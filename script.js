@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(to right, #ff7e5f, #feb47b);
    color: #fff;
    text-align: center;
    margin: 0;
    padding: 0;
    animation: fadeIn 2s ease-in-out;
}

h1 {
    margin-top: 20px;
    font-size: 3em;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    animation: popIn 1s ease-out;
}

.video-container {
    display: flex;
    justify-content: center;
    margin: 20px;
    flex-wrap: wrap;
}

video {
    width: 45%;
    border: 4px solid #fff;
    border-radius: 15px;
    margin: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    transition: transform 0.5s, box-shadow 0.5s;
}

video:hover {
    transform: scale(1.1);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.controls {
    margin-top: 20px;
    animation: slideIn 1s ease-out;
}

input {
    padding: 15px;
    margin: 10px;
    border: none;
    border-radius: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    font-size: 1em;
    outline: none;
    width: calc(100% - 40px);
}

button {
    padding: 15px 30px;
    margin: 10px;
    border: none;
    border-radius: 30px;
    background: linear-gradient(to right, #ff7e5f, #feb47b);
    color: #fff;
    cursor: pointer;
    font-size: 1em;
    transition: background 0.3s, box-shadow 0.3s;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    outline: none;
    width: calc(100% - 40px);
}

button:hover {
    background: linear-gradient(to right, #feb47b, #ff7e5f);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

#uniqueId {
    margin-top: 15px;
    font-size: 1.5em;
    color: #fff;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    animation: fadeIn 2s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from { transform: translateY(-20px); }
    to { transform: translateY(0); }
}

@keyframes popIn {
    from { transform: scale(0.5); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
