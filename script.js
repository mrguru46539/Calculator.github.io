// Simple calculator logic
(function(){
  const display = document.getElementById('display');
  const keys = document.querySelectorAll('.key');
  let expr = ''; // current expression string

  function updateDisplay(){
    display.textContent = expr === '' ? '0' : expr;
  }

  function append(value){
    // Prevent multiple leading zeros like "00"
    if (expr === '0' && value === '0') return;
    // Prevent leading zero before number (allow "0." though)
    if (expr === '0' && value !== '.' && !isOperator(value)) expr = value;
    else expr += value;
    updateDisplay();
  }

  function isOperator(ch){
    return ['+','-','*','/'].includes(ch);
  }

  function clearAll(){
    expr = '';
    updateDisplay();
  }

  function del(){
    expr = expr.slice(0,-1);
    updateDisplay();
  }

  function calculate(){
    if (!expr) return;
    // Validate: allow only digits, operators, parentheses, dot and spaces
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      display.textContent = 'Error';
      expr = '';
      return;
    }
    try{
      // Use Function instead of eval for slightly safer eval
      // Still only use after validating characters above.
      // Evaluate with standard JS arithmetic precedence.
      const result = Function('"use strict"; return (' + expr + ')')();
      // Handle invalid results
      if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
        display.textContent = 'Error';
        expr = '';
        return;
      }
      expr = String(result);
      updateDisplay();
    }catch(e){
      display.textContent = 'Error';
      expr = '';
    }
  }

  // Wire button clicks
  keys.forEach(key => {
    key.addEventListener('click', () => {
      const val = key.getAttribute('data-value');
      const action = key.getAttribute('data-action');

      if (action === 'clear') return clearAll();
      if (action === 'delete') return del();
      if (action === 'calculate') return calculate();

      if (val) {
        // normalize displayed symbols for multiply/divide to JS operators
        const normalized = val === '×' ? '*' : val === '÷' ? '/' : val;
        append(normalized);
      }
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') { append(e.key); e.preventDefault(); return; }
    if (['+','-','*','/','.','(',')'].includes(e.key)) { append(e.key); e.preventDefault(); return; }
    if (e.key === 'Enter' || e.key === '=') { calculate(); e.preventDefault(); return; }
    if (e.key === 'Backspace') { del(); e.preventDefault(); return; }
    if (e.key === 'Escape') { clearAll(); e.preventDefault(); return; }
  });

  // Initialize
  clearAll();
})();