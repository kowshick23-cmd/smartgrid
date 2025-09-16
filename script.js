document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize all battery gauges
    document.querySelectorAll('.gauge').forEach(gauge => {
        const percentage = gauge.dataset.percentage;
        updateGauge(gauge, percentage);
    });

    // Initialize all energy graphs
    document.querySelectorAll('.energy-graph').forEach((canvas, index) => {
        createEnergyGraph(canvas, index);
    });

    // Initialize timeline graph
    initializeTimelineGraph();
    
    // Calculate and update total power stats
    updateTotalPowerStats();
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

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items and pages
            navItems.forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked item and corresponding page
            item.classList.add('active');
            const pageName = item.dataset.page;
            document.querySelector(`.${pageName}-page`).classList.add('active');
        });
    });
}

function initializeTimelineGraph() {
    const ctx = document.getElementById('timelineGraph').getContext('2d');
    const timeLabels = generateTimeLabels();
    const powerData = generateTimelineData();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Total Power Generation (kWh)',
                data: powerData,
                borderColor: '#64b5f6',
                backgroundColor: 'rgba(100, 181, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

function generateTimeLabels() {
    const labels = [];
    for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
    }
    return labels;
}

function generateTimelineData() {
    return Array.from({length: 24}, () => Math.floor(Math.random() * 500 + 200));
}

function updateTotalPowerStats() {
    let totalSolar = 0;
    let totalHydro = 0;
    let totalBattery = 0;
    let houseCount = 0;

    document.querySelectorAll('.house-card').forEach(house => {
        const solar = parseFloat(house.querySelector('.solar p').textContent.split(':')[1]);
        const hydro = parseFloat(house.querySelector('.hydro p').textContent.split(':')[1]);
        const battery = parseFloat(house.querySelector('.percentage').textContent);

        totalSolar += solar;
        totalHydro += hydro;
        totalBattery += battery;
        houseCount++;
    });

    document.getElementById('total-solar').textContent = `${totalSolar.toFixed(1)} MWh`;
    document.getElementById('total-hydro').textContent = `${totalHydro.toFixed(1)} kWh`;
    document.getElementById('avg-battery').textContent = `${(totalBattery / houseCount).toFixed(1)}%`;
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

    // Update total power stats
    updateTotalPowerStats();
}, 5000);  // Update every 5 seconds

// Handle time range changes
document.getElementById('timeRange').addEventListener('change', function(e) {
    // In a real application, this would fetch new data based on the selected time range
    initializeTimelineGraph();
});