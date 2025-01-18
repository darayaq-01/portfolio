interface CarouselElements {
  carousel: HTMLElement;
  leftButton: HTMLButtonElement;
  rightButton: HTMLButtonElement;
  container: HTMLElement;
}

// Get DOM elements
export const getCarouselElements = (): CarouselElements | null => {
  const elements = {
    carousel: document.getElementById("carousel"),
    leftButton: document.getElementById("left-button") as HTMLButtonElement,
    rightButton: document.getElementById("right-button") as HTMLButtonElement,
    container: document.getElementById("carousel-container"),
  };

  return Object.values(elements).every(Boolean)
    ? (elements as CarouselElements)
    : null;
};

// Calculations
const calculateScrollPositions = (carousel: HTMLElement) => ({
  isAtStart: carousel.scrollLeft === 0,
  isAtEnd:
    carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 1,
});

const calculateItemWidth = (carousel: HTMLElement): number =>
  carousel.querySelector("button")?.offsetWidth ?? 0;

// UI updates
const updateOpacityProperties = (
  container: HTMLElement,
  isAtStart: boolean,
  isAtEnd: boolean
): void => {
  container.style.setProperty("--left-opacity", isAtStart ? "0" : "1");
  container.style.setProperty("--right-opacity", isAtEnd ? "0" : "1");
};

const updateButtonStates = (
  leftButton: HTMLButtonElement,
  rightButton: HTMLButtonElement,
  isAtStart: boolean,
  isAtEnd: boolean
): void => {
  leftButton.disabled = isAtStart;
  rightButton.disabled = isAtEnd;
};

// Scroll handlers
const createScrollHandlers = (carousel: HTMLElement) => {
  const GAP_SIZE = 32;
  const itemWidth = calculateItemWidth(carousel);

  return {
    scrollNext: () =>
      carousel.scrollBy({
        left: itemWidth + GAP_SIZE,
        behavior: "smooth",
      }),
    scrollPrevious: () =>
      carousel.scrollBy({
        left: -(itemWidth + GAP_SIZE),
        behavior: "smooth",
      }),
  };
};

// Main initialization
export const initializeCarousel = (elements: CarouselElements): void => {
  const { carousel, leftButton, rightButton, container } = elements;
  const { scrollNext, scrollPrevious } = createScrollHandlers(carousel);

  const handleScroll = () => {
    const { isAtStart, isAtEnd } = calculateScrollPositions(carousel);
    updateOpacityProperties(container, isAtStart, isAtEnd);
    updateButtonStates(leftButton, rightButton, isAtStart, isAtEnd);
  };

  leftButton.addEventListener("click", scrollPrevious);
  rightButton.addEventListener("click", scrollNext);
  carousel.addEventListener("scroll", handleScroll);

  handleScroll();
};
