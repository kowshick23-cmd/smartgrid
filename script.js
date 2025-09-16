document.addEventListener('DOMContentLoaded', function() {
    // Initialize all battery gauges
    document.querySelectorAll('.gauge').forEach(gauge => {
        const percentage = gauge.dataset.percentage;
        updateGauge(gauge, percentage);
    });

    // Initialize all energy graphs
    document.querySelectorAll('.energy-graph').forEach((canvas, index) => {
        createEnergyGraph(canvas, index);
    });
});

function updateGauge(gaugeElement, percentage) {
    const rotation = (percentage / 100) * 360;
    gaugeElement.style.setProperty('--rotation', `${rotation}deg`);
    
    // Update battery icon based on percentage
    const batteryIcon = gaugeElement.parentElement.querySelector('i');
    if (batteryIcon) {
        batteryIcon.className = getBatteryIconClass(percentage);
    }
}

function getBatteryIconClass(percentage) {
    if (percentage >= 90) return 'fas fa-battery-full';
    if (percentage >= 70) return 'fas fa-battery-three-quarters';
    if (percentage >= 40) return 'fas fa-battery-half';
    if (percentage >= 10) return 'fas fa-battery-quarter';
    return 'fas fa-battery-empty';
}

function createEnergyGraph(canvas, houseIndex) {
    // Generate some random data for demonstration
    const data = generateRandomData();
    
    // Create gradient
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, 'rgba(100, 181, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(100, 181, 246, 0)');

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: Array.from({length: 12}, (_, i) => `${i*2}:00`),
            datasets: [{
                label: 'Energy Usage',
                data: data,
                borderColor: '#64b5f6',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                backgroundColor: gradient,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ffffff',
                pointHoverBorderWidth: 2,
                pointHoverBorderColor: '#64b5f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(19, 47, 76, 0.9)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    borderColor: 'rgba(100, 181, 246, 0.3)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Energy Usage: ${context.parsed.y.toFixed(1)} kWh`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    display: false
                },
                x: {
                    display: false
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: false
            }
        }
    });
}

function generateRandomData() {
    return Array.from({length: 12}, () => Math.random() * 100);
}

// Simulate real-time updates
setInterval(() => {
    // Update battery percentages randomly
    document.querySelectorAll('.gauge').forEach(gauge => {
        const currentPercentage = parseInt(gauge.dataset.percentage);
        const newPercentage = Math.max(0, Math.min(100, currentPercentage + (Math.random() - 0.5) * 5));
        gauge.dataset.percentage = newPercentage.toFixed(0);
        updateGauge(gauge, newPercentage);
        gauge.querySelector('.percentage').textContent = `${newPercentage.toFixed(0)}%`;
    });
}, 5000);  // Update every 5 seconds