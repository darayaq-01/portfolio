export async function fetchContributions(username: string) {
  const TOKEN = import.meta.env.GITHUB_TOKEN;

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

