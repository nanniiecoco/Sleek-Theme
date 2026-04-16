document.addEventListener('DOMContentLoaded', function() {
    // Enable multiple accordions on a page
    document.querySelectorAll('.accordion-toggle').forEach(function(toggle) {
        const panelId = toggle.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (!panel) return;

        toggle.addEventListener('click', function() {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            panel.hidden = expanded;
        });
    });
});