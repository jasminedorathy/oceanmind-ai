import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_oceanographic_data():
    dates = [datetime(2020, 1, 1) + timedelta(days=x) for x in range(365)]
    regions = ['Indian Ocean', 'Pacific Ocean', 'Atlantic Ocean']
    data = []
    for region in regions:
        base_temp = 22 if region == 'Indian Ocean' else 18 if region == 'Pacific Ocean' else 16
        for date in dates:
            temp = base_temp + np.random.normal(0, 2) + (date.month * 0.2)
            salinity = 35 + np.random.normal(0, 0.5)
            bio_index = max(1, 9 - (temp - 18) * 0.5 + np.random.normal(0, 0.5))
            data.append([
                date.strftime('%Y-%m-%d'), 
                region, 
                round(temp, 2), 
                round(salinity, 2), 
                round(bio_index, 2)
            ])
    
    df = pd.DataFrame(data, columns=['date', 'region', 'temperature', 'salinity', 'biodiversity_index'])
    # Save in current dir
    df.to_csv('ocean-monitor-telemetry.csv', index=False)
    print("Generated ocean-monitor-telemetry.csv")

if __name__ == "__main__":
    generate_oceanographic_data()
