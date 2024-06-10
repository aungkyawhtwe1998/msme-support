const Home = () => {
  const resources = [
    {
      id: 1,
      title: "Business Planning 101",
      url: "https://example.com/business-planning",
    },
    {
      id: 2,
      title: "Marketing Strategies",
      url: "https://example.com/marketing-strategies",
    },
    {
      id: 3,
      title: "Financial Management",
      url: "https://example.com/financial-management",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl text-gray-700 border-b border-gray-100 pb-5 font-extrabold mb-5">
        Learning <span className="text-blue-600">Resources</span>
      </h1>
      <ul>
        {resources.map((resource) => (
          <li key={resource.id}>
            <a
              href={resource.url}
              target="_blank"
              className="text-blue-500"
              rel="noopener noreferrer">
              {resource.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
