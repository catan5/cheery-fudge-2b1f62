# Daily Match Refresh Pipeline

This repository now includes an automated pipeline that refreshes match outcomes daily from the Zafronix FIFA API.

## How It Works

1. **Scheduled Trigger**: The workflow runs every day at 6 AM UTC (configurable)
2. **Manual Trigger**: Can be triggered anytime from GitHub Actions tab
3. **Fetches Data**: Calls `https://api.zafronix.com/fifa/worldcup/v1/tournaments`
4. **Updates HTML**: Regenerates `index.html` with the latest match outcomes
5. **Auto-Commits**: Automatically commits and pushes changes if match data changed

## Setup Required

### Step 1: Add Repository Secret

1. Navigate to your repo: **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following:
   - **Name**: `ZAFRONIX_API_URL`
   - **Value**: `https://api.zafronix.com/fifa/worldcup/v1/tournaments`
4. Click **Add secret**

### Step 2: Merge the Pipeline Branch

1. Go to your repo's **Pull requests** tab
2. Open the PR for `add-daily-refresh-pipeline` branch
3. Review the changes and click **Merge pull request**

## Files Added

- `.github/workflows/daily-refresh.yml` - GitHub Actions workflow definition
- `scripts/update-match-data.js` - Node.js script that fetches and updates match data

## Manual Testing

To test the workflow manually:

1. Go to your repo → **Actions** tab
2. Select **Daily Match Refresh** workflow
3. Click **Run workflow** → **Run workflow**
4. Monitor the execution in real-time

## Expected API Response Format

The script expects the API to return data in this structure:

```json
{
  "tournaments": [
    {
      "id": "fifa-2026",
      "matches": [
        {
          "id": "R32-1",
          "date": "2026-06-20",
          "stadium": "Stadium Name",
          "city": "City",
          "team1_code": "MEX",
          "team1": "Mexico",
          "team2_code": "POL",
          "team2": "Poland",
          "team1_score": 1,
          "team2_score": 0,
          "status": "played",
          "weather": {
            "temperature_c": 28,
            "condition": "Sunny"
          }
        }
      ]
    }
  ]
}
```

## Troubleshooting

- Check the **Actions** tab for workflow logs if updates aren't running
- Verify the API URL in your repository secrets
- Ensure the API endpoint is accessible and returning valid JSON

## Customization

To change the daily run time, edit `.github/workflows/daily-refresh.yml` and modify the `cron` expression:

```yaml
schedule:
  - cron: '0 6 * * *'  # Change this to your preferred time
```

Use [crontab.guru](https://crontab.guru) to generate cron expressions.
