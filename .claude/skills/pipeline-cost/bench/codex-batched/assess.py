"""Apply the prespecified pilot rule to independent gate vectors and showing timestamps."""
import json
import math
import statistics
import sys
from pathlib import Path


def assess(trials, protocol):
    by = {t['label']: t for t in trials}
    reasons, metrics = [], {}
    labels = [t['label'] for t in trials]
    if len(labels) != len(set(labels)) or set(labels) != set(protocol['order']):
        reasons.append('Exactly one result per prescribed trial is required; extras/duplicates/missing labels refused')
    for label in protocol['order']:
        trial = by.get(label, {})
        if trial.get('completed') is not True:
            reasons.append(label + ': incomplete/censored')
        gates = trial.get('quality', {})
        failed = [gate for gate in protocol['quality_gates'] if gates.get(gate) is not True]
        if failed:
            reasons.append(label + ': failed/unknown gates ' + ', '.join(failed))
        first, revision = trial.get('first_seconds'), trial.get('revision_seconds')
        if any(not isinstance(t, (int, float)) or isinstance(t, bool) or not math.isfinite(t) or t <= 0 for t in [first, revision]):
            reasons.append(label + ': invalid/missing timing')
        else:
            metrics[label] = {'first': first, 'revision': revision, 'total': first + revision}
    if len(metrics) == 4:
        medians = {condition: {part: statistics.median(metrics[f'{condition}-{n}'][part] for n in [1, 2])
                               for part in ['first', 'revision', 'total']} for condition in ['before', 'after']}
        ratios = {part: medians['after'][part] / medians['before'][part] for part in ['first', 'revision', 'total']}
        if ratios['total'] > 1 - protocol['pilot_total_median_reduction']:
            reasons.append('Median total reduction below 20%')
        for part in ['first', 'revision']:
            if ratios[part] > 1 + protocol['maximum_episode_median_regression']:
                reasons.append(part + ': median regressed more than 5%')
        for before, after in protocol['matched_pairs']:
            if metrics[after]['total'] >= metrics[before]['total']:
                reasons.append('No positive savings: ' + before + '/' + after)
    else:
        medians, ratios = {}, {}
    return {'qualifies': not reasons, 'reasons': reasons, 'seconds': metrics, 'medians': medians, 'after_before_ratios': ratios,
            'quality': {label: by.get(label, {}).get('quality', {}) for label in protocol['order']},
            'claim_scope': protocol['claim_scope']}


if __name__ == '__main__':
    protocol = json.loads(Path(__file__).with_name('protocol.json').read_text())
    print(json.dumps(assess(json.loads(Path(sys.argv[1]).read_text()), protocol), indent=2))
