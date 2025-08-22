

const Faq = () => {
  const faqs = [
    {
      question: "What is Forumify?",
      answer: "Forumify is a modern MERN stack-based forum platform where users can hold conversations in the form of posted messages. It's designed to be a dedicated space for community, knowledge sharing, and passionate discussions."
    },
    {
      question: "How do I get a Bronze Badge?",
      answer: "A Bronze Badge is automatically awarded to any user who registers on the site for the first time. It's a token of our appreciation for joining the Forumify community."
    },
    {
      question: "What is the difference between a Bronze and Gold Badge?",
      answer: "A Bronze Badge is for all registered users. A Gold Badge is a special membership badge given to users who become a member of the site by paying a small fee. Gold members can create more than 5 posts, unlike regular users."
    },
    {
      question: "How do I add a new post?",
      answer: "You can add a new post from your user dashboard. Click on your profile picture in the navbar and select 'Dashboard', then navigate to the 'Add Post' page. Normal users can add up to 5 posts, but this limit is removed for Gold members."
    },
    {
      question: "How does the popularity sorting work?",
      answer: "The 'Sort by Popularity' feature calculates a post's popularity based on the difference between its UpVote and DownVote counts. Posts are then displayed in descending order of this popularity score."
    },
  ];

  return (
    <div className="min-h-screen py-16 bg-base-200">
      <div className="container px-4 mx-auto md:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl text-primary">Frequently Asked Questions</h1>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-secondary">
            Can't find the answer you're looking for? Feel free to contact us.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="shadow-lg bg-base-300 collapse collapse-plus rounded-xl">
              <input type="radio" name="my-accordion-3" id={`accordion-${index}`} defaultChecked={index === 0} />
              <div className="text-xl font-medium collapse-title text-primary">
                <label htmlFor={`accordion-${index}`}>{faq.question}</label>
              </div>
              <div className="collapse-content">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;