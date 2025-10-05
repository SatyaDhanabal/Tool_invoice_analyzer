function computeScores(rows, matchResult, ruleResult, questionnaire) {
    const totalFields = matchResult.coverage.matched.length +
                        matchResult.coverage.close.length +
                        matchResult.coverage.missing.length;
  
    // Data Score: percent of rows successfully parsed
    const dataScore = rows.length > 0 ? 100 : 0;
  
    // Coverage Score: based on matched/close/missing
    const coverageWeight = {
      matched: 1.0,
      close: 0.5,
      missing: 0.0
    };
    const coverageScore = Math.round(
      (
        matchResult.coverage.matched.length * coverageWeight.matched +
        matchResult.coverage.close.length * coverageWeight.close
      ) / totalFields * 100
    );
  
    // Rule Score: percent of rules that passed
    const passedRules = ruleResult.findings.filter(f => f.ok).length;
    const ruleScore = Math.round((passedRules / ruleResult.findings.length) * 100);
  
    // Posture Score: based on questionnaire (webhooks, sandbox_env, retries)
    const yesAnswers = ['webhooks', 'sandbox_env', 'retries'].filter(k => questionnaire[k]);
    const postureScore = Math.round((yesAnswers.length / 3) * 100);
  
    // Final weighted score
    const weights = {
      data: 0.25,
      coverage: 0.35,
      rules: 0.30,
      posture: 0.10
    };
  
    const overall = Math.round(
      dataScore * weights.data +
      coverageScore * weights.coverage +
      ruleScore * weights.rules +
      postureScore * weights.posture
    );
  
    return {
      data: dataScore,
      coverage: coverageScore,
      rules: ruleScore,
      posture: postureScore,
      overall
    };
  }
  
  module.exports = computeScores;
  