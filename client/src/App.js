import React from "react";
import axios from 'axios';
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bestShows: [],
      newName: '',
      newValue: '',
      editId: null
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    axios.get('/api/data')
      .then(res => this.setState({ bestShows: res.data }))
      .catch(alert);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { newName, newValue, editId } = this.state;

    if(editId) { // Update
      axios.put(`/api/data/${editId}`, { name: newName, value: Number(newValue) })
        .then(() => {
          this.setState({ newName: '', newValue: '', editId: null });
          this.loadData();
        }).catch(alert);
    } else { // Create
      axios.post('/api/data', { name: newName, value: Number(newValue) })
        .then(() => {
          this.setState({ newName: '', newValue: '' });
          this.loadData();
        }).catch(alert);
    }
  }

  handleDelete = (id) => {
    if(window.confirm("Supprimer cet item ?")) {
      axios.delete(`/api/data/${id}`)
        .then(() => this.loadData())
        .catch(alert);
    }
  }

  handleEdit = (item) => {
    this.setState({
      newName: item.name,
      newValue: item.value,
      editId: item._id
    });
  }

  render() {
    const { bestShows, newName, newValue, editId } = this.state;

    return (
      <div className="container">
        <h1>Azure MERN Demo</h1>
        <form onSubmit={this.handleSubmit} className="form">
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={e => this.setState({ newName: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Value"
            value={newValue}
            onChange={e => this.setState({ newValue: e.target.value })}
            required
          />
          <button type="submit">{editId ? 'Modifier' : 'Ajouter'}</button>
          {editId && <button type="button" onClick={() => this.setState({ editId: null, newName: '', newValue: '' })}>Annuler</button>}
        </form>

        <ul className="item-list">
          {bestShows.map(item => (
            <li key={item._id}>
              <span><strong>{item.name}</strong> : {item.value}</span>
              <div className="actions">
                <button onClick={() => this.handleEdit(item)}>Edit</button>
                <button onClick={() => this.handleDelete(item._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;