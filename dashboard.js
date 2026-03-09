function go(page){
    window.location.href = page;
}

/* Donut Chart */
new Chart(document.getElementById("donutChart"), {
    type: "doughnut",
    data: {
        labels: ["In Progress", "Completed", "Not Started"],
        datasets: [{
            data: [10, 6, 3],
            backgroundColor: ["#2b4eff","#1b8f5a","#d9822b"]
        }]
    }
});

/* Bar Chart */
new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
        labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        datasets: [{
            label: "Hours",
            data: [8,9,2,4,7,1,6],
            backgroundColor:"#2b4eff"
        }]
    }
});
