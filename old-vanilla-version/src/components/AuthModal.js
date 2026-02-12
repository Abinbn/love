export function createAuthModal() {
  const modal = document.createElement('div');
  modal.id = 'auth-modal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn">×</button>
      <div class="auth-tabs">
        <button class="tab-btn active" data-tab="login">Login</button>
        <button class="tab-btn" data-tab="signup">Sign Up</button>
      </div>
      
      <form id="login-form" class="auth-form">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input type="email" id="login-email" required>
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" required>
        </div>
        <button type="submit" class="submit-btn">Login</button>
      </form>
      
      <form id="signup-form" class="auth-form" style="display: none;">
        <div class="form-group">
          <label for="signup-email">Email</label>
          <input type="email" id="signup-email" required>
        </div>
        <div class="form-group">
          <label for="signup-password">Password</label>
          <input type="password" id="signup-password" required>
        </div>
        <div class="form-group">
          <label for="signup-confirm">Confirm Password</label>
          <input type="password" id="signup-confirm" required>
        </div>
        <button type="submit" class="submit-btn">Sign Up</button>
      </form>
    </div>
  `;
  return modal;
}