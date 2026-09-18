const deck = document.querySelector("#deck");
const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".progress span")];
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

let activeIndex = 0;
let wheelLocked = false;
let swipeLocked = false;
let touchStartX = 0;
let touchStartY = 0;

function clampIndex(index) {
  return Math.max(0, Math.min(index, slides.length - 1));
}

function goTo(index) {
  const targetIndex = clampIndex(index);

  if (targetIndex === activeIndex) {
    return;
  }

  setActive(targetIndex);

  deck.scrollTo({
    left: targetIndex * deck.clientWidth,
    behavior: "smooth"
  });
}

function setActive(index) {
  activeIndex = clampIndex(index);

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeIndex);
  });

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("in-view", slideIndex === activeIndex);
  });

  document
    .querySelector("#progress")
    .setAttribute("aria-label", `Page ${activeIndex + 1} of ${slides.length}`);

  previous.disabled = activeIndex === 0;
  next.disabled = activeIndex === slides.length - 1;
}

previous.addEventListener("click", () => {
  goTo(activeIndex - 1);
});

next.addEventListener("click", () => {
  goTo(activeIndex + 1);
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    goTo(index);
  });
});

deck.addEventListener(
  "scroll",
  () => {
    const currentPage = Math.round(deck.scrollLeft / deck.clientWidth);
    setActive(currentPage);
  },
  { passive: true }
);

window.addEventListener("keydown", (event) => {
  if (["TEXTAREA", "INPUT"].includes(document.activeElement.tagName)) {
    return;
  }

  if (event.key === "ArrowRight") {
    goTo(activeIndex + 1);
  }

  if (event.key === "ArrowLeft") {
    goTo(activeIndex - 1);
  }
});

deck.addEventListener(
  "wheel",
  (event) => {
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX) || wheelLocked) {
      return;
    }

    event.preventDefault();
    wheelLocked = true;

    goTo(activeIndex + (event.deltaY > 0 ? 1 : -1));

    setTimeout(() => {
      wheelLocked = false;
    }, 650);
  },
  { passive: false }
);

/* Mobile swipe: one swipe = one page only */

deck.addEventListener(
  "touchstart",
  (event) => {
    const touch = event.changedTouches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  },
  { passive: true }
);

deck.addEventListener(
  "touchend",
  (event) => {
    if (swipeLocked) {
      return;
    }

    const touch = event.changedTouches[0];
    const distanceX = touch.clientX - touchStartX;
    const distanceY = touch.clientY - touchStartY;

    const isHorizontalSwipe =
      Math.abs(distanceX) > 45 &&
      Math.abs(distanceX) > Math.abs(distanceY);

    if (!isHorizontalSwipe) {
      return;
    }

    swipeLocked = true;

    if (distanceX < 0) {
      goTo(activeIndex + 1);
    } else {
      goTo(activeIndex - 1);
    }

    setTimeout(() => {
      swipeLocked = false;
    }, 700);
  },
  { passive: true }
);

document.querySelector("#copyEmail").addEventListener("click", async () => {
  const message = document.querySelector("#copyMessage");

  try {
    await navigator.clipboard.writeText("drzbusinesss@gmail.com");
    message.textContent = "COPIED!";
  } catch {
    message.textContent = "COPY FAILED";
  }

  setTimeout(() => {
    message.textContent = "";
  }, 1600);
});

document.querySelector("#mailForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const body = encodeURIComponent(
    document.querySelector("#mailMessage").value.trim()
  );

  window.location.href =
    `mailto:drzbusinesss@gmail.com?subject=${encodeURIComponent(
      "Message from Dr Z Portfolio"
    )}&body=${body}`;
});

document.querySelectorAll(".external-link").forEach((link) => {
  link.addEventListener("click", () => {
    link.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(.94)" },
        { transform: "scale(1)" }
      ],
      {
        duration: 280,
        easing: "ease-out"
      }
    );
  });
});

window.addEventListener("resize", () => {
  deck.scrollTo({
    left: activeIndex * deck.clientWidth,
    behavior: "auto"
  });
});

setActive(0);
