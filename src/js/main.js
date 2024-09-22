document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("from");
    const container = document.getElementById("container");
    let liftStatus = [];

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const numberOfFloors = parseInt(document.getElementById("input-floors").value);
        const numberOfLifts = parseInt(document.getElementById("input-lifts").value);
        container.innerHTML = '';
        liftStatus = Array(numberOfLifts).fill({ position: 0, busy: false }); // Reset lift statuses
        generateBuilding(numberOfFloors, numberOfLifts);
        addLiftButtonListeners(numberOfFloors);
    });
    
    function generateBuilding(floors, lifts) {


        for (let i = 0; i < floors; i++) {
            const floorDiv = document.createElement("div");
            floorDiv.classList.add("floor");
            floorDiv.setAttribute("id", `floor-${i}`);

            
            const upButton =(i< floors-1)?`<button class="up-button" data-floor="${i}">Up</button>`:"";
            const downButton = (i!==0)?`<button class="down-button" data-floor="${i}">Down</button>`:"";


            floorDiv.innerHTML = `
                <div class="floor-number">Floor ${i}</div>
                <div class="lift-area"></div>
                <div class="button-area">
                    ${upButton}
                    ${downButton}
                </div>
            `;
            container.appendChild(floorDiv);
        }

        // Add lifts to the ground floor
        const groundFloor = document.getElementById("floor-0").querySelector(".lift-area");

        
        for (let i = 0; i < lifts; i++) {
            const liftContainer = document.createElement("div");
            liftContainer.classList.add("lift-container");
            groundFloor.appendChild(liftContainer)
            const liftDiv = document.createElement("div");
            liftDiv.classList.add("lift");
            liftDiv.setAttribute("id", `lift-${i + 1}`);
            liftDiv.setAttribute("data-lift-index", i); // Store lift index for tracking
            // liftDiv.innerHTML = `<div class="lift-door"></div>`;
            liftDiv.innerHTML=`
            <div class="lift-door-left"></div>
            <div class="lift-door-right"></div>`;
            liftContainer.appendChild(liftDiv);
        }
    }

    function addLiftButtonListeners(floors) {
        const upButtons = document.querySelectorAll(".up-button");
        const downButtons = document.querySelectorAll(".down-button");

        upButtons.forEach(button => {
            button.addEventListener("click", function () {
                const floor = parseInt(this.getAttribute("data-floor"));
                requestLift(floor - 1); // Move to the next floor
            });
        });

        downButtons.forEach(button => {
            button.addEventListener("click", function () {
                const floor = parseInt(this.getAttribute("data-floor"));
                requestLift(floor - 1); // Move to the previous floor
            });
        });
    }

    function requestLift(targetFloor) {
        const availableLifts = liftStatus.filter(lift => !lift.busy); // Find available lifts

        if (availableLifts.length === 0) {
            console.log("All lifts are busy.");
            return; // All lifts are busy
        }

        // Find the nearest lift to the target floor
        let nearestLiftIndex = -1;
        let minDistance = Infinity;
        liftStatus.forEach((lift, index) => {
            if (!lift.busy) {
                const distance = Math.abs(lift.position - targetFloor);
                if (distance < minDistance) {
                    nearestLiftIndex = index;
                    minDistance = distance;
                }
            }
        });

        // Move the nearest lift
        if (nearestLiftIndex !== -1) {
            moveLiftToFloor(nearestLiftIndex, targetFloor);
        }
    }

    function moveLiftToFloor(liftIndex, targetFloor) {
        const TargetFloor=targetFloor+1
        const lift = document.querySelector(`#lift-${liftIndex + 1}`);
        const floorHeight = document.querySelector(".floor").offsetHeight;

        // Mark the lift as busy
        liftStatus[liftIndex] = { position: TargetFloor, busy: true };

        // Move the lift using the transform property
        lift.style.transform = `translateY(-${floorHeight * TargetFloor}px)`;+

        setTimeout(()=>{
            lift.classList.add('open'); 
        setTimeout(()=>{
            lift.classList.remove('open')
        },2500)
        },2000);
        // After the animation completes (2 seconds), mark the lift as available again
        setTimeout(() => {
            liftStatus[liftIndex].busy = false;
        }, 2000); // Assuming the transition duration is 2 seconds
    }
});
