import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      searchTerm: '',
      sortBy: '',
      totalPages: 3
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.page !== this.state.page ||
      prevState.sortBy !== this.state.sortBy ||
      prevState.searchTerm !== this.state.searchTerm
    ) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    try {
      let url = `http://localhost:5000/customers?page=${this.state.page}`;
      if (this.state.sortBy) {
        url += `&sortBy=${this.state.sortBy}`;
      }
      if (this.state.searchTerm) {
        url += `&search=${this.state.searchTerm}`;
      }
      const response = await axios.get(url);
      this.setState({ data: response.data });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= this.state.totalPages) {
      this.setState({ page: newPage });
    }
  };

  handleSortChange = sortType => {
    this.setState({ sortBy: sortType });
  };

  handleSearch = e => {
    const searchTerm = e.target.value;
    this.setState({ searchTerm });
    if (searchTerm === '') {
      this.setState({ page: 1, sortBy: '' });
    }
  };

  handleRefresh = () => {
    window.location.reload();
  };

  renderPagination = () => {
    const { totalPages, page } = this.state;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => this.handlePageChange(i)}
          className={page === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        {pages}
      </div>
    );
  };

  render() {
    const { data, searchTerm, sortBy, page, totalPages } = this.state;

    return (
      <div className='container'>
        <h1>ZITHARA CUSTOMER DATABASE</h1>
        <div className='sort-box'>
          <div>
            <input
              type="text"
              placeholder="Search by name or location"
              value={searchTerm}
              onChange={this.handleSearch}
            />
          </div>
          <div className='sort-button'>
            <button
              className={sortBy === 'date' ? 'active' : ''}
              onClick={() => this.handleSortChange('date')}
            >
              Sort: By Date
            </button>
            <button
              className={sortBy === 'time' ? 'active' : ''}
              onClick={() => this.handleSortChange('time')}
            >
              Sort: By Time
            </button>
            <button onClick={this.handleRefresh}>
              Refresh
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Customer Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7">No Records Found With Your Provided Input</td>
              </tr>
            ) : (
              data.map(customers => (
                <tr key={customers.sno}>
                  <td>{customers.sno}</td>
                  <td>{customers.customer_name}</td>
                  <td>{customers.age}</td>
                  <td>{customers.phone}</td>
                  <td>{customers.location}</td>
                  <td>{new Date(customers.date).toLocaleDateString()}</td>
                  <td>{customers.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className='bottom-box'>
          <button onClick={() => this.handlePageChange(page - 1)} disabled={page === 1}>
            Prev
          </button>
          {this.renderPagination()}
          <button onClick={() => this.handlePageChange(page + 1)} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default App;
