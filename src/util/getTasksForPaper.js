export default function getTasksForPaper(data, paperTitle) {
    return data.filter(task =>
      task.datasets.some(
        x => x.sota && x.sota.sota_rows.some(x => x.paper_title === paperTitle)
      )
    );
  }
  