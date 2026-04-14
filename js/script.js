let GlobalSlideNo = 0;
const SLIDE_WIDTH = 440; // width of .input-slide

const IndicatorObj = {
    currentWidth: 0,
    endVal: 0,
    stepNo: 0,
    isMoving: false
};

function NextSlide(slideNo, e) {
    if (e) e.preventDefault();

    // Validation logic for current slide
    const currentSlide = document.querySelectorAll(".input-slide")[GlobalSlideNo];
    const inputs = currentSlide.querySelectorAll("input");
    let allValid = true;

    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();
            allValid = false;
        }
    });

    if (!allValid) return;

    GlobalSlideNo = slideNo;

    // Show Back button if we move past first slide
    if (slideNo === 1) {
        const goBackBtn = document.querySelector(".goBack");
        goBackBtn.style.animation = "GoBackBtnVisible 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards";
    }

    // Scroll to next slide
    const scroller = document.getElementById("scroller");
    scroller.style.marginLeft = -(slideNo * SLIDE_WIDTH) + "px";

    MoveIndicatorBar(slideNo + 1);

    // Enable submit button if on last slide
    if (slideNo === 3) {
        setTimeout(() => {
            const submitBtn = document.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = false;
        }, 600);
    }
}

function GoBack(e) {
    if (e) e.preventDefault();
    if (GlobalSlideNo === 0) return;

    GlobalSlideNo--;

    // Hide Back button if moving back to first slide
    if (GlobalSlideNo === 0) {
        const goBackBtn = document.querySelector(".goBack");
        goBackBtn.style.animation = "GoBackBtnInVisible 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards";
    }

    // Scroll back
    const scroller = document.getElementById("scroller");
    scroller.style.marginLeft = -(GlobalSlideNo * SLIDE_WIDTH) + "px";

    MoveIndicatorBar(GlobalSlideNo + 1);
}

function MoveIndicatorBar(stepIndex) {
    IndicatorObj.stepNo = stepIndex;
    IndicatorObj.endVal = (stepIndex - 1) * 25;
    
    // Update step classes
    const steps = document.querySelectorAll(".steps");
    steps.forEach((step, index) => {
        if (index < stepIndex - 1) {
            step.classList.add("PassedStep");
        } else {
            step.classList.remove("PassedStep");
        }
    });

    if (!IndicatorObj.isMoving) {
        IndicatorObj.isMoving = true;
        AnimateProgressBar();
    }
}

function AnimateProgressBar() {
    const bar = document.querySelector(".active");
    const target = IndicatorObj.endVal;
    const current = IndicatorObj.currentWidth;

    if (Math.abs(current - target) < 1) {
        IndicatorObj.currentWidth = target;
        bar.style.width = target + "%";
        IndicatorObj.isMoving = false;
        return;
    }

    // Smooth interpolation
    const speed = 2;
    if (current < target) {
        IndicatorObj.currentWidth += speed;
    } else {
        IndicatorObj.currentWidth -= speed;
    }

    bar.style.width = IndicatorObj.currentWidth + "%";
    requestAnimationFrame(AnimateProgressBar);
}

// Attach event listeners to buttons to avoid deprecated "event" usage in HTML
document.addEventListener("DOMContentLoaded", () => {
    // We already have onclick in HTML, but we can fix NextSlide calls to pass event
    // or just leave them and use window.event if browser supports it.
    // To be professional, I'll update the HTML to pass 'event'.
});