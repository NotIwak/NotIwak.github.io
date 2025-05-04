// Check Level
document.addEventListener('DOMContentLoaded', () => {
    // Request Current Page CL request
    const requiredLevel = parseInt(document.documentElement.dataset.minLevel) || 1;
    
    // Get Auth Data
    const authData = JSON.parse(sessionStorage.getItem('scp_auth'));

    // Check If:
    if (
        !authData || // Didn't Login
        Date.now() - authData.loginTime > 30 * 60 * 1000 || // Stayed Over 30mins
        authData.level < requiredLevel // Level Not enough
    ) {
        // Clear Ineffective Login status
        sessionStorage.removeItem('scp_auth');
        // Jump to Denied Page
        window.location.href = 'Denied.html';
    }
});