
function solveT(p0, p1, p2, p3, x) {
    let t = 0.5;
    for (let i = 0; i < 20; i++) {
        // x(t) = (1-t)^3 p0 + 3(1-t)^2 t p1 + 3(1-t) t^2 p2 + t^3 p3
        let a = (1-t);
        let xt = a*a*a*p0 + 3*a*a*t*p1 + 3*a*t*t*p2 + t*t*t*p3;
        // derivative x'(t)
        let dxt = 3*a*a*(p1-p0) + 6*a*t*(p2-p1) + 3*t*t*(p3-p2);
        
        let diff = xt - x;
        if (Math.abs(diff) < 0.001) return t;
        t = t - diff / dxt;
    }
    return t;
}

function getY(p0, p1, p2, p3, t) {
    let a = (1-t);
    return a*a*a*p0 + 3*a*a*t*p1 + 3*a*t*t*p2 + t*t*t*p3;
}

// Definitions from RechargeContent.tsx
const curves = [
    { 
        name: "Blue", 
        // d="M0,192 C40,90 140,50 328,35"
        pts: [ {x:0, y:192}, {x:40, y:90}, {x:140, y:50}, {x:328, y:35} ],
        targets: [35, 95, 178, 258] 
    },
    { 
        name: "Gold", 
        // d="M0,192 C60,130 160,85 328,85"
        pts: [ {x:0, y:192}, {x:60, y:130}, {x:160, y:85}, {x:328, y:85} ],
        targets: [48, 110, 185, 300]
    },
    { 
        name: "Bottom", 
        // d="M0,192 C100,160 200,130 328,110"
        pts: [ {x:0, y:192}, {x:100, y:160}, {x:200, y:130}, {x:328, y:110} ],
        targets: [41, 123, 205, 287] 
    }
];

curves.forEach(c => {
    console.log(`\n${c.name} Curve Points:`);
    c.targets.forEach(x => {
        let t = solveT(c.pts[0].x, c.pts[1].x, c.pts[2].x, c.pts[3].x, x);
        let y = getY(c.pts[0].y, c.pts[1].y, c.pts[2].y, c.pts[3].y, t);
        console.log(`X: ${x}, Y: ${y.toFixed(2)}`);
    });
});
