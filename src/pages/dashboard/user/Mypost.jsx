const Mypost = () => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Votes</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Forum Post Title</td>
            <td>23</td>
            <td>
              <button className="btn btn-xs btn-info">Comments</button>
            </td>
            <td>
              <button className="btn btn-xs btn-error">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Mypost;
