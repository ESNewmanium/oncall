import { ThresholdsMode } from '@grafana/data';
import { SceneFlexItem, SceneQueryRunner, VizPanel } from '@grafana/scenes';

import { InsightsConfig } from 'pages/insights/Insights.types';

export default function getNewAlertGroupsForSelectedPeriodScene({ datasource }: InsightsConfig) {
  const query = new SceneQueryRunner({
    datasource,
    queries: [
      {
        disableTextWrap: false,
        editorMode: 'code',
        excludeNullMetadata: false,
        exemplar: false,
        expr: 'increase(max_over_time(sum(avg without(pod, instance) ($alert_groups_total{slug=~"$stack", team=~"$team", integration=~"$integration"}))[1d:])[$__range:])',
        format: 'time_series',
        fullMetaSearch: false,
        includeNullMetadata: true,
        instant: true,
        legendFormat: '__auto',
        range: false,
        refId: 'A',
        useBackend: false,
      },
    ],
  });

  return new SceneFlexItem({
    $data: query,
    body: new VizPanel({
      title: 'New alert groups for selected period',
      pluginId: 'stat',
      fieldConfig: {
        defaults: {
          color: {
            mode: 'thresholds',
          },
          decimals: 0,
          mappings: [],
          thresholds: {
            mode: ThresholdsMode.Absolute,
            steps: [
              {
                color: 'text',
                value: null,
              },
            ],
          },
          unit: 'none',
        },
        overrides: [
          {
            matcher: {
              id: 'byName',
              options: 'Value',
            },
            properties: [
              {
                id: 'displayName',
                value: 'New alert groups',
              },
            ],
          },
        ],
      },
      options: {
        colorMode: 'value',
        graphMode: 'none',
        justifyMode: 'center',
        orientation: 'auto',
        reduceOptions: {
          calcs: ['lastNotNull'],
          fields: '',
          values: false,
        },
        textMode: 'auto',
      },
    }),
  });
}
