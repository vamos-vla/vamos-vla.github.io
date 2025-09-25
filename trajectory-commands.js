// Trajectory Commands Configuration
// Define the commands to show for each trajectory type and scenario

const TRAJECTORY_COMMANDS = {
    // Ramp scenario commands
    'ramp': {
        'all': 'All paths',
        'original': 'Original path',
        'left': '"Take the ramp on the left"',
        'right': '"Take the stairs on the right"'
    },
    
    // Tree scenario commands
    'tree': {
        'all': 'All paths',
        'original': 'Original path',
        'left': '"Circle left around tree"',
        'right': '"Circle right around tree"'
    },
    
    // Grass scenario commands
    'grass': {
        'all': 'All paths',
        'original': 'Original path',
        'modified': '"Make a right turn to cut across the grass"'
    },
    
    // U-pole scenario commands
    'u_pole': {
        'all': 'All paths',
        'original': 'Original path',
        'modified': '"Make a right turn to go between the poles"'
    }
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TRAJECTORY_COMMANDS;
}
