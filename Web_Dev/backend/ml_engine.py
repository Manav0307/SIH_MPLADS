import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(BASE_DIR, "saved_models")

class MLEngine:
    """Lazy-loading ML engine — models only load when predict() is first called."""

    def __init__(self):
        self.loaded = False
        self._models_attempted = False

    def _load_models(self):
        """Load models on first use, not at startup."""
        if self._models_attempted:
            return
        self._models_attempted = True
        try:
            import joblib
            self.preprocessor = joblib.load(os.path.join(OUT_DIR, 'preprocessor.pkl'))
            self.iso_forest = joblib.load(os.path.join(OUT_DIR, 'iso_forest.pkl'))
            self.scaler = joblib.load(os.path.join(OUT_DIR, 'score_scaler.pkl'))
            self.rf_pipeline = joblib.load(os.path.join(OUT_DIR, 'rf_pipeline.pkl'))
            self.cols = joblib.load(os.path.join(OUT_DIR, 'feature_columns.pkl'))
            self.loaded = True
            print("ML models loaded successfully.")
        except Exception as e:
            print(f"Error loading models: {e}")
            self.loaded = False

    def predict(self, raw_data_dict):
        self._load_models()

        if not self.loaded:
            return {"anomaly_score": 0.0, "stall_probability": 0.0, "risk_category": "Unknown", "risk_score": 0.0}

        import pandas as pd
        df = pd.DataFrame([raw_data_dict])

        for c in self.cols:
            if c not in df.columns:
                df[c] = 0
        df = df[self.cols]

        X_proc = self.preprocessor.transform(df)
        iso_score = -self.iso_forest.score_samples(X_proc)
        iso_scaled = self.scaler.transform(iso_score.reshape(-1, 1))[0][0]

        stall_prob = self.rf_pipeline.predict_proba(df)[0][1]

        risk_score = max(iso_scaled, stall_prob)
        if iso_scaled > 0.8 and stall_prob > 0.8:
            category = "Critical Audit Required"
        elif iso_scaled < 0.5 and stall_prob > 0.8:
            category = "Systemic Delay"
        elif iso_scaled > 0.8 and stall_prob < 0.5:
            category = "Financial Irregularity"
        else:
            if risk_score > 0.7:
                category = "High Priority"
            elif risk_score > 0.4:
                category = "Requires Review"
            else:
                category = "Healthy"

        return {
            "anomaly_score": float(iso_scaled),
            "stall_probability": float(stall_prob),
            "risk_score": float(risk_score),
            "risk_category": category
        }
