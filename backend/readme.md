# BB Foundry Test Backend

This is the backend of the BB Foundry Test app. It comprises of three main endpoints: 

- `/employees`
- `/clients`
- `/engagements`

Each of the specs can be found below.

# Setup

## Installation

```bash
$ npm install
```

## Running

```bash
$ npm start
```

# Routes

## Employees and clients

The endpoints for clients are the same with the exception of their names. For brevity's sake, they have been documented below as `/employees`. This is convenient, too, because they each only have two attributes: `id` and `name`. 

### `GET /employees`

Fetches all employees

```JSON
// response
[
	{
		id: "123-abc",
		name: "Alice"
	}
]
```

### `GET /employees/:id`

Fetches an employee with the given id

```JSON
// response
{
	id: "123-abc",
	name: "Alice"
}
```

#### Throws

- 404: if no employee is found with the given id

### `POST /employees`

Create a new employee

```JSON
// request
{ "name": "John Smith" }

// response
{
	id: "123-abc",
	name: "John Smith"
}
```

### `PUT /employees/:id`

Update an employee with the given id

```JSON
// request
{ "name": "Someone else" }

// response
{ updated: "123-abc"}
```

### `GET /employees/:id/engagemnts`

Fetches a list of engagements that an employee with the given id has been a part of.

```JSON
// response
[
	{
		id: "123-abc",
		name: "Time and materials",
		client: "client-123-abc",
		employee: "empoyee-123-abc",
		description: "Time and materials with ACME Co",
		started: "2021-07-04T03:33:49.845Z",
		ended: null | "2021-07-04T03:33:49.845Z"
	}
]
```

## Engagements

Engagements are periods of time when an employee is working for a client. A client can have multiple projects going on.

### `GET /engagements`

```JSON
// response
[
	{
		id: "123-abc",
		name: "Time and materials",
		client: "client-id",
		employee: "empoyee-id",
		description: "Time and materials with ACME Co",
		started: "2021-07-04T03:33:49.845Z",
		ended: null | "2021-07-04T03:33:49.845Z"
	}
]
```

### `GET /engagements/:id`

```JSON
// response
{
	id: "123-abc",
	name: "Time and materials",
	client: "client-id",
	employee: "empoyee-id",
	description: "Time and materials with ACME Co",
	started: "2021-07-04T03:33:49.845Z",
	ended: null | "2021-07-04T03:33:49.845Z"
}
```

### `POST /engagement`

Creates an engagement between a client and employee. This starts the engagement.

```JSON
// request
{
	name: "Time and materials",
	client: "client-id",
	employee: "employee-id",
	description: "Time and materials contract with ACME Co", // optional
}

// response 
{
	id: "123-abc",
	name: "Time and materials",
	client: "client-id",
	employee: "employee-id",
	started: "2021-07-04T03:33:49.845Z",
	description: "Time and materials contract with ACME Co"
}
```

### `PUT /engagement/:id/end`

Ends the engagement

```JSON
// response
{
	ended: "2021-07-04T03:33:49.845Z"
}
```

### `PUT /engagement/:id`

Only the name and description of an engagement can be edited.

```JSON
// request 
{
	name: "Fixed engagement name", // optional
	description: "Some actual text" // optional
}
// response
{
	updated: "abc-123"
}
```

#### Throws

- 400: Invalid request
