import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Инициализация стейта из LocalStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Сохранение при каждом изменении массива tasks
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    
    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1>TASK<span>MASTER</span></h1>
        <form onSubmit={addTask} className="input-group">
          <input 
            type="text" 
            placeholder="Фокус на задаче..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">+</button>
        </form>
        
        <div className="filter-bar">
          {['all', 'active', 'completed'].map(f => (
            <button 
              key={f}
              className={filter === f ? 'active' : ''} 
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'ВСЕ' : f === 'active' ? 'В РАБОТЕ' : 'ГОТОВО'}
            </button>
          ))}
        </div>
      </header>

      <ul className="todo-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <div className="task-content" onClick={() => toggleTask(task.id)}>
              <span className="checkbox"></span>
              <p>{task.text}</p>
            </div>
            <button className="del-btn" onClick={() => deleteTask(task.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;