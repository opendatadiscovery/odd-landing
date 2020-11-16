'use strict'

console.clear();

const urlTodos = "https://jsonplaceholder.typicode.com/todos";
const urlUsers = "https://jsonplaceholder.typicode.com/users";

const loadData = async url => await fetch(url).then(response => response.json());

const getTodos = loadData(urlTodos);
const getUsers = loadData(urlUsers);

// select all todos
const selectAll = async () => await getTodos;

selectAll(1).then(res => {
  console.assert(res.length === 200);
});


/*

  Exercise 2.
  1. Implement all functions below;
  2. Convert this file to TypeScript, create interfaces for input data;
  
  Optional: 3. Write a helper function which acts like a wrapper and memoizes the result of any selector function

*/

// 1. grouping todos by users:
const getTodosGroupedByUsers = async () => {
    const todos = await selectAll();                           
    const groupedUsers = todos.reduce( (acc, el) => {           
        const user = `user${el.userId}`;
        
        const newAcc = {
            ...acc,
            [user]: acc[user] ? [...acc[user], el] : [el]
        }

        return newAcc
    }, {});

    return groupedUsers
};

getTodosGroupedByUsers().then( res => {
    console.log(res)
    console.assert(res['user5'][0].userId === 5); 
});

// 2. select all user's todos by userId:
const selectTodosByUserId = async userId => {
    return await getTodos.then(todos => todos.filter(todo => todo.userId === userId));
};

selectTodosByUserId(3).then(res => {
    console.assert(res.length === 20);   
    console.assert(res[0].userId === 3); 
});

// 3. select todos by user name:
const selectUserByName = async name => {
    return await getUsers.then(users => users.find(user => user.name === name));
};

const selectTodosByUserName = async name => {
    const user = await selectUserByName(name);
    const userId = user ? user.id : null;
    return await selectTodosByUserId(userId)
};

selectTodosByUserName("Kurtis Weissnat").then(res => {
    console.assert(res[0].userId === 7);
});


// 4. Use https://jsonplaceholder.typicode.com/users to load data about selected todos' authors and print result to console:
const selectUserById = async id => {
    return await getUsers.then(users => users.find(user => user.id === id));
};

const selectedTodosAuthors = async todos => {
    const authorsPromises = todos.map(async el => {
        return await selectUserById(el.userId)
    })

    const authors = await Promise.all(authorsPromises)

    return authors.reduce( (acc, el) => {
        return acc.includes(el.name) ? acc : [...acc, el.name]
    }, [])
}

selectTodosByUserId(5).then(async res => {
    const authors = await selectedTodosAuthors(res);
    console.log(authors)
})


