document.addEventListener('DOMContentLoaded', function() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Initialize navigation
    initializeNavigation();
    
    // Add mobile menu toggle
    initializeMobileMenu();
    
    // Initialize all battery gauges with staggered animation
    document.querySelectorAll('.gauge').forEach((gauge, index) => {
        setTimeout(() => {
            const percentage = gauge.dataset.percentage;
            updateGauge(gauge, percentage);
        }, index * 100);
    });
    
    // Remove loading class after initialization
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 500);

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
            // Add transition class to main content
            document.querySelector('.main-content').classList.add('page-transition');
            
            // Remove active class from all items and pages
            navItems.forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Switch pages with transition
            const pageName = item.dataset.page;
            setTimeout(() => {
                document.querySelector(`.${pageName}-page`).classList.add('active');
                document.querySelector('.main-content').classList.remove('page-transition');
            }, 300);

            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('active');
            }
        });
    });
}

function initializeMobileMenu() {
    // Add menu toggle button to HTML if it doesn't exist
    if (!document.querySelector('.sidebar-toggle')) {
        const button = document.createElement('button');
        button.className = 'sidebar-toggle';
        button.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(button);
    }

    // Toggle sidebar on button click
    document.querySelector('.sidebar-toggle').addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.querySelector('.sidebar-toggle');
        if (!sidebar.contains(e.target) && !toggle.contains(e.target) && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.querySelector('.sidebar').classList.remove('active');
        }
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
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#64b5f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    right: 20,
                    bottom: 10,
                    left: 20
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: 'white',
                        font: {
                            size: 12
                        },
                        boxWidth: 15,
                        padding: 15
                    }
                },
                tooltip: {
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
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'white',
                        padding: 10,
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + ' kWh';
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'white',
                        padding: 8,
                        font: {
                            size: 11
                        },
                        maxRotation: 0
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

function generateTimeLabels(timeRange) {
    const labels = [];
    const now = new Date();
    
    switch(timeRange) {
        case '24h':
            // Generate 24 hour labels
            for (let i = 0; i < 24; i++) {
                labels.push(`${i}:00`);
            }
            break;
        
        case '7d':
            // Generate 7 day labels
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
            }
            break;
        
        case '30d':
            // Generate 30 day labels
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            }
            break;
    }
    
    return labels;
}

function generateTimelineData(timeRange) {
    const dataPoints = {
        '24h': 24,
        '7d': 7,
        '30d': 30
    };

    const maxValues = {
        '24h': 500,
        '7d': 3000,
        '30d': 4000
    };

    const minValues = {
        '24h': 200,
        '7d': 1000,
        '30d': 2000
    };

    return Array.from(
        { length: dataPoints[timeRange] },
        () => Math.floor(Math.random() * (maxValues[timeRange] - minValues[timeRange]) + minValues[timeRange])
    );
}

let timelineChart = null;

function initializeTimelineGraph(timeRange = '24h') {
    const ctx = document.getElementById('timelineGraph').getContext('2d');
    const timeLabels = generateTimeLabels(timeRange);
    const powerData = generateTimelineData(timeRange);

    // Destroy existing chart if it exists
    if (timelineChart) {
        timelineChart.destroy();
    }

    timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Total Power Generation (kWh)',
                data: powerData,
                borderColor: '#64b5f6',
                backgroundColor: 'rgba(100, 181, 246, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#64b5f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    right: 20,
                    bottom: 10,
                    left: 20
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'center',
                    labels: {
                        color: 'white',
                        font: {
                            size: 12
                        },
                        boxWidth: 15,
                        padding: 15
                    }
                },
                tooltip: {
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
                            return `Power Generation: ${context.parsed.y.toLocaleString()} kWh`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'white',
                        padding: 10,
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value.toLocaleString() + ' kWh';
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'white',
                        padding: 8,
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'index',
                intersect: false
            }
        }
    });
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
    initializeTimelineGraph(e.target.value);
});