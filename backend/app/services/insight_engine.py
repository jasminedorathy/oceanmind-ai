import pandas as pd
import numpy as np
import json

class InsightEngine:
    @staticmethod
    def get_schema(df: pd.DataFrame):
        schema = {
            "numeric": [],
            "categorical": [],
            "datetime": []
        }
        for col in df.columns:
            if pd.api.types.is_numeric_dtype(df[col]):
                schema["numeric"].append(col)
            elif pd.api.types.is_datetime64_any_dtype(df[col]) or "date" in col.lower() or "time" in col.lower():
                schema["datetime"].append(col)
            else:
                schema["categorical"].append(col)
        return schema

    @staticmethod
    def generate_insights(df: pd.DataFrame):
        insights = []
        schema = InsightEngine.get_schema(df)
        
        # 1. Statistical Trends (Numeric Columns)
        for col in schema["numeric"]:
            mean = df[col].mean()
            std = df[col].std()
            max_val = df[col].max()
            min_val = df[col].min()
            
            # Anomaly Detection (Simple Z-Score)
            last_val = df[col].iloc[-1]
            if abs(last_val - mean) > 2 * std:
                insights.append({
                    "type": "Critical",
                    "category": "Anomaly Detection",
                    "text": f"Extreme variance detected in '{col}': Current value {round(last_val, 2)} is significantly outside standard deviation range ({round(mean - 2*std, 2)} - {round(mean + 2*std, 2)})."
                })

            # Trend Detection
            if len(df) > 10:
                first_avg = df[col].iloc[:5].mean()
                last_avg = df[col].iloc[-5:].mean()
                diff_pct = ((last_avg - first_avg) / first_avg) * 100 if first_avg != 0 else 0
                if abs(diff_pct) > 10:
                    status = "Ascending" if diff_pct > 0 else "Descending"
                    insights.append({
                        "type": "Trend",
                        "category": "Historical Analysis",
                        "text": f"'{col}' is in a sustained {status} trend, shifting by {round(diff_pct, 1)}% over requested timeline."
                    })

        # 2. Cross-Correlation (Dynamic Variable Linkage)
        if len(schema["numeric"]) > 1:
            corr_matrix = df[schema["numeric"]].corr()
            for i in range(len(schema["numeric"])):
                for j in range(i + 1, len(schema["numeric"])):
                    col_a = schema["numeric"][i]
                    col_b = schema["numeric"][j]
                    val = corr_matrix.loc[col_a, col_b]
                    if abs(val) > 0.7:
                        strength = "Strong" if abs(val) > 0.85 else "Significant"
                        direction = "Positive" if val > 0 else "Negative"
                        insights.append({
                            "type": "AI Insight",
                            "category": "Variable Linkage",
                            "text": f"Found {strength} {direction} Linkage ({round(val, 2)}) between '{col_a}' and '{col_b}'. These variables appear to be mutually dependent."
                        })

        return insights

    @staticmethod
    def suggest_visuals(df: pd.DataFrame):
        schema = InsightEngine.get_schema(df)
        visuals = []
        
        # Prefer Timeseries
        time_col = schema["datetime"][0] if schema["datetime"] else None
        
        # Time-series Line Charts
        if time_col:
            for num_col in schema["numeric"]:
                visuals.append({
                    "type": "line",
                    "title": f"{num_col} Over Time",
                    "x_axis": time_col,
                    "y_axis": num_col,
                    "recommended_for": "Trend Analysis"
                })
        
        # Categorical Bar Charts
        if schema["categorical"]:
            cat_col = schema["categorical"][0]
            for num_col in schema["numeric"]:
                visuals.append({
                    "type": "bar",
                    "title": f"Distribution by {cat_col} ({num_col})",
                    "x_axis": cat_col,
                    "y_axis": num_col,
                    "recommended_for": "Comparative Analysis"
                })
        
        # Fallback to simple indices if no time or categories
        if not time_col and not schema["categorical"]:
            for num_col in schema["numeric"]:
                visuals.append({
                    "type": "area",
                    "title": f"Incremental Density of {num_col}",
                    "x_axis": "index",
                    "y_axis": num_col,
                    "recommended_for": "Density Tracking"
                })

        return visuals
