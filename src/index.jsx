import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

console.clear();

// Container Component
// Todo Id
window.id = 0;
class TodoApp extends React.Component{
  constructor(props){
    super(props);
      this.myLabel="";
    this.state = {
        data: [],
        completed:[]
    }
    this.apiUrl = 'http://5c3840aa7820ff0014d9281c.mockapi.io/api/v1/todos';
    this.CompletedapiUrl = 'http://5c3840aa7820ff0014d9281c.mockapi.io/api/v1/completedtodos';
  }
  // Lifecycle method
  componentDidMount(){
    // Make HTTP reques with Axios
    axios.get(this.apiUrl).then((res) => {
        this.setState({data:res.data});
    });
    axios.get(this.CompletedapiUrl).then((res) => {
        this.setState({completed:res.data});
    });
  }
  // Add todo handler
  addTodo(val){
    // Assemble data
    const todo = {text: val}
    // Update data
    axios.post(this.apiUrl, todo)
       .then((res) => {
          this.state.data.push(res.data);
          this.setState({data: this.state.data});
       });
  }
  // Handle remove
  handleRemove(id,flag){
    // Filter all todos except the one to be removed
      var arrayList = [],url;
      if(flag=="todo"){
          arrayList = this.state.data;
          url = this.apiUrl;
      }else{
          arrayList = this.state.completed;
          url = this.CompletedapiUrl;
      }

    const remainder = arrayList.filter((todo) => {
      if(todo.id !== id) return todo;
    });

    axios.delete(url+'/'+id)
      .then((res) => {
          if(flag=="todo"){
              this.setState({
                data: remainder
              });
          }else{
              this.setState({
                  completed: remainder
              });
          }
      });
  }
  handleCompleted(id, flag) {

      //Marking completed & removing from *todo* list
      const remainder = this.state.data.filter((todo) => {
          if(todo.id !== id) return todo;
      });

      axios.delete(this.apiUrl+'/'+id).then((res) => {
          this.setState({
              data: remainder
          });
      });

      //Adding value to completed
      var indexVal = this.state.data.findIndex(x => x.id === id);

      var value =this.state.data[indexVal].text;
        const todocompleted = {text: value}
        axios.post(this.CompletedapiUrl, todocompleted)
                .then((res) => {
                    this.state.completed.push(res.data);
                    this.setState({completed: this.state.completed});
                });
  }

  handleEdit(id, flag) {
      var action = $('#span'+flag+id).text();
      if(action=='Edit'){
          $('#myLabel'+flag+id).attr("contentEditable", true).focus();
          $('#span'+flag+id).text('Save');
      }else{
          $('#span'+flag+id).text('Edit');
          $('#myLabel'+flag+id).attr("contentEditable", false);
          var changedVal = $('#myLabel+flag'+id).val();
          var todoChangedVal = {
              text:changedVal
          }
          if(flag=='todo'){
              var indexVal = this.state.data.findIndex(x => x.id === id);
              this.state.data[findIndex].text = changedVal;

          }else{
              var indexVal = this.state.completed.findIndex(x => x.id === id);
              this.state.completed[findIndex].text = changedVal;
          }

      }

  }

  render(){
    // Render JSX
    return (
      <div>
          <div>
              <div className="title-container">
                  <span>ADD ITEM</span>
              </div>
            <TodoForm addTodo={this.addTodo.bind(this)}/>
          </div>

          <div>
          <div className="title-container">
              <span>TODO</span>
          </div>
            <TodoList
              todos={this.state.data}
              remove={this.handleRemove.bind(this)}
              change = {this.handleCompleted.bind(this)}
              edit = {this.handleEdit.bind(this)}
              flag="todo"
            />
          </div>

          <div>
              <div className="title-container">
                  <span>COMPLETED</span>
              </div>
              <TodoList
                      todos={this.state.completed}
                      remove={this.handleRemove.bind(this)}
                      change = {this.handleCompleted.bind(this)}
                      edit = {this.handleEdit.bind(this)}
                      flag="completed"
              />
          </div>
      </div>
    );
  }
}


const Title = ({todoCount}) => {
    return (
            <div>
                <div>
                    <h1>to-do ({todoCount})</h1>
                </div>
            </div>
    );
}

const TodoForm = ({addTodo}) => {
    // Input Tracker
    let input;
    // Return JSX
    return (
            <form className="form-inline" onSubmit={(e) => {
                e.preventDefault();
                addTodo(input.value);
                input.value = '';
            }}>
                <div className="form-group mb-2">
                    <input className="form-control col-md-12" ref={node => {
                        input = node;
                    }} />
                </div>
                <div className="form-group mx-sm-3 mb-2">
                    <button className="btn btn-primary" type="submit">Add</button>
                </div>
                <br />
            </form>

    );
};

const Todo = ({todo, remove, edit, change, flag}) => {
    // Each Todo
    return (<div className="list-group-item">
        <div className="pull-left">
            {(flag === 'todo') ?
                    <input id="cbox4" type="checkbox" className="cbox4" value="fourth_checkbox" onChange={() => {change(todo.id,flag)}} /> :
                    <input id="cbox4" type="checkbox" className="cbox4" value="fourth_checkbox" checked/>
            }
            <label name={"myLabel"+flag+todo.id} id={"myLabel"+flag+todo.id} className="todo-lable" style={{marginLeft:'10px'}} for="cbox4">
                {todo.text}
            </label>
        </div>
        <div className="text-right">
                    <span id={"span"+flag+todo.id} className="action" onClick={(e) => {
                        e.preventDefault();
                        edit(todo.id,flag);
                    }}>Edit</span>
            <span className="action" onClick={() => {remove(todo.id,flag)}}>Delete</span>
        </div>
    </div>);


}

const TodoList = ({todos, remove, change, edit, flag}) => {
    // Map through the todos
    const todoNode = todos.map((todo) => {
        return (<Todo todo={todo} key={todo.id} remove={remove} edit={edit} change={change} flag={flag}  />)
    });
    return (<div className="list-group" style={{marginTop:'30px'}}>{todoNode}</div>);
}

render(<TodoApp />, document.getElementById('container'));
