const ALLOWED_CURRENCIES = ['AED', 'SAR', 'MYR', 'USD'];

function round(n) {
  return Math.round(n * 100) / 100;
}

function runRules(rows, matchResult) {
  const findings = [];
  const gaps = [];

  let hasDateIssue = false;
  let hasCurrencyIssue = false;
  let hasTRN = true;
  let lineMathFailed = false;
  let totalsFailed = false;

  rows.forEach((row, idx) => {
    const totalExcl = parseFloat(row['invoice.total_excl_vat']);
    const vat = parseFloat(row['invoice.vat_amount']);
    const totalIncl = parseFloat(row['invoice.total_incl_vat']);
    if (!isNaN(totalExcl) && !isNaN(vat) && !isNaN(totalIncl)) {
      const sum = round(totalExcl + vat);
      if (Math.abs(sum - round(totalIncl)) > 0.01) {
        if (!totalsFailed) {
          findings.push({
            rule: 'TOTALS_BALANCE',
            ok: false,
            exampleLine: idx + 1,
            expected: sum,
            got: totalIncl
          });
          totalsFailed = true;
        }
      }
    }

    const qty = parseFloat(row['lines[].qty']);
    const price = parseFloat(row['lines[].unit_price']);
    const lineTotal = parseFloat(row['lines[].line_total']);
    if (!isNaN(qty) && !isNaN(price) && !isNaN(lineTotal)) {
      const expectedLineTotal = round(qty * price);
      if (Math.abs(expectedLineTotal - round(lineTotal)) > 0.01) {
        if (!lineMathFailed) {
          findings.push({
            rule: 'LINE_MATH',
            ok: false,
            exampleLine: idx + 1,
            expected: expectedLineTotal,
            got: lineTotal
          });
          lineMathFailed = true;
        }
      }
    }

    const date = row['invoice.issue_date'];
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      hasDateIssue = true;
    }

    const currency = row['invoice.currency'];
    if (currency && !ALLOWED_CURRENCIES.includes(currency)) {
      hasCurrencyIssue = true;
    }

    if (!row['buyer.trn'] || !row['seller.trn']) {
      hasTRN = false;
    }
  });

  // Ensure every rule has a finding
  if (!findings.find(f => f.rule === 'TOTALS_BALANCE')) {
    findings.push({ rule: 'TOTALS_BALANCE', ok: true });
  }

  if (!findings.find(f => f.rule === 'LINE_MATH')) {
    findings.push({ rule: 'LINE_MATH', ok: true });
  }

  findings.push({
    rule: 'DATE_ISO',
    ok: !hasDateIssue
  });

  if (hasDateIssue) gaps.push('Invalid date format');

  findings.push({
    rule: 'CURRENCY_ALLOWED',
    ok: !hasCurrencyIssue,
    value: hasCurrencyIssue ? rows[0]['invoice.currency'] : undefined
  });

  if (hasCurrencyIssue) gaps.push(`Invalid currency ${rows[0]['invoice.currency']}`);

  findings.push({
    rule: 'TRN_PRESENT',
    ok: hasTRN
  });

  if (!hasTRN) gaps.push('Missing buyer.trn or seller.trn');

  return {
    findings,
    gaps
  };
}

module.exports = runRules;
