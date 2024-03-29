/* Circle Type 1 */
function openCircle() {
    var offsetTop = $(window).scrollTop();
    $(".circle-wrap").css("top", offsetTop);

    $(".circle-a").css("display", "flex");
    $("body").css("overflow", "hidden");

    setTimeout(() => {
        $(".circle-a").css("display", "none");
        $("body").css("overflow", "auto");
    }, 4000);
}

/* Circle Type 2 */
function openCircle2() {
    var offsetTop = $(window).scrollTop();
    $(".circle-wrap").css("top", offsetTop);

    $(".circle-b").css("display", "flex");
    $("body").css("overflow", "hidden");

    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 2;
    const ALERT_THRESHOLD = 1;

    const COLOR_CODES = {
        info: {
            color: "green"
        },
        warning: {
            color: "orange",
            threshold: WARNING_THRESHOLD
        },
        alert: {
            color: "red",
            threshold: ALERT_THRESHOLD
        }
    };

    const TIME_LIMIT = 3;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;
    let remainingPathColor = COLOR_CODES.info.color;

    document.getElementById("app").innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span class="base-timer__title">작업완료</span>
      
    </div>
    <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
    )}</span>
    `;

    startTimer();

    function onTimesUp() {
        clearInterval(timerInterval);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
            document.getElementById("base-timer-label").innerHTML = formatTime(
                timeLeft
            );
            setCircleDasharray();
            setRemainingPathColor(timeLeft);

            if (timeLeft === 0) {
                onTimesUp()
                setTimeout(() => {
                    $(".circle-b").css("display", "none");
                    $("body").css("overflow", "auto");
                }, 1000);
            }
        }, 1000);
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds < 10) {
            seconds = `${seconds}`;
        }

        return `${seconds}`;
    }

    function setRemainingPathColor(timeLeft) {
        const { alert, warning, info } = COLOR_CODES;
        if (timeLeft <= alert.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(warning.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(info.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(warning.color);
        }
    }

    function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }

    function setCircleDasharray() {
        const circleDasharray = `${(
            calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
            .getElementById("base-timer-path-remaining")
            .setAttribute("stroke-dasharray", circleDasharray);
    }
}

/* Circle Type 3 */
function openCircle3() {
    var offsetTop = $(window).scrollTop();
    $(".circle-wrap").css("top", offsetTop);

    $(".circle-c").css("display", "flex");
    $("body").css("overflow", "hidden");

    setTimeout(() => {
        $(".circle-c").css("display", "none");
        $("body").css("overflow", "auto");
    }, 4000);
}