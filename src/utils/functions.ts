export async function fetchContributions(username: string) {
  const TOKEN = import.meta.env.TOKEN_GITHUB;

  // Calculate dates for the query
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setFullYear(endDate.getFullYear() - 1);

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                weekday
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    username,
    from: startDate.toISOString(),
    to: endDate.toISOString()
  };

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  if (!response.ok || data.errors) {
    console.log("---------------------------")
    console.error("GitHub API Error:", data.errors || data);
    console.log("---------------------------")
    throw new Error("Failed to fetch GitHub contributions");
  }

  const days =
    data.data?.user?.contributionsCollection.contributionCalendar.weeks.flatMap(
      (week: { contributionDays: any[] }) => week.contributionDays
    );

  const dayStartYear = days[0].weekday;

  return days.map((day: { date: string; weekday: number; contributionCount: number }) => ({
    date: formatDate(day.date),
    weekday: getDayWeek(day.weekday),
    count: day.contributionCount,
    level: getContributionLevel(day.contributionCount),
    dayToStart: dayStartYear,
  }));
}

function getContributionLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 10) return 1;
  if (count <= 20) return 2;
  if (count <= 30) return 3;
  return 4;
}

function getDayWeek(weekday: number): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[weekday] || "N/A";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
}

// Masonry Grid Functions

export function resizeMasonryItem(item: HTMLElement) {
  const grid = document.querySelector(".masonry-grid") as HTMLElement
  const rowHeight = Number.parseInt(window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"))
  const rowGap = Number.parseInt(window.getComputedStyle(grid).getPropertyValue("grid-row-gap"))

  const content = item.querySelector(".masonry-content") as HTMLElement
  const rowSpan = Math.ceil((content.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap))

  item.style.gridRowEnd = `span ${rowSpan}`
}

export function resizeAllMasonryItems() {
  const visibleItems = document.querySelectorAll(".masonry-item:not(.hidden)")
  visibleItems.forEach((item) => resizeMasonryItem(item as HTMLElement))
}

export function handleIntersection(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const lazyImage = entry.target.querySelector(".lazy-image") as HTMLImageElement
      if (lazyImage && lazyImage.dataset.src) {
        lazyImage.src = lazyImage.dataset.src
        lazyImage.removeAttribute("data-src")
        lazyImage.classList.remove("lazy-image")
      }
      resizeMasonryItem(entry.target as HTMLElement)
      observer.unobserve(entry.target)
    }
  })
}

export function loadMoreItems(allItems: HTMLElement[], visibleItems: number, observer: IntersectionObserver) {
  const windowWidth = window.innerWidth
  let itemsToLoad = 3
  if (windowWidth >= 1024) {
    itemsToLoad = 12 - visibleItems
  } else if (windowWidth >= 768) {
    itemsToLoad = 9 - visibleItems
  } else {
    itemsToLoad = 3
  }

  const hiddenItems = allItems.slice(visibleItems, visibleItems + itemsToLoad)
  hiddenItems.forEach((item) => {
    item.classList.remove("hidden")
    observer.observe(item)
  })

  const newVisibleItems = visibleItems + itemsToLoad

  resizeAllMasonryItems()

  return newVisibleItems
}

export function showLessItems(allItems: HTMLElement[], currentVisibleItems: number) {
  allItems.forEach((item, index) => {
    if (index >= 3) {
      item.classList.add("hidden");
    }
  });

  resizeAllMasonryItems()

  return 3
}

