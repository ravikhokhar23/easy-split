import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [isAddFriend, setIsAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleNewFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setIsAddFriend(false);
  }

  function handleAddFriendClick() {
    setIsAddFriend((isAdd) => !isAdd);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
  }

  function handleSplitBill(balance) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + balance }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {isAddFriend && <AddFriendForm onAddFriend={handleNewFriend} />}
        <Button onClick={handleAddFriendClick}>
          {isAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <SplitBillForm
          friend={selectedFriend}
          handleSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          onSelection={onSelection}
          friend={friend}
          selectedFriend={selectedFriend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even!</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick, type }) {
  return (
    <button type={type} className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) {
      return;
    }
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🫅Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📸Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button type={"submit"}>Add</Button>
    </form>
  );
}

function SplitBillForm({ friend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const friendExpense = bill ? bill - yourExpense : "";
  const [billPaying, setBillPaying] = useState("user");

  function onSplitBill(e) {
    e.preventDefault();
    let balance = 0;

    balance =
      billPaying === "user"
        ? parseInt(friendExpense)
        : parseInt(yourExpense) * -1;

    handleSplitBill(balance);
    setBill("");
    setYourExpense("");
    setBillPaying("user");
  }

  return (
    <form className="form-split-bill" onSubmit={onSplitBill}>
      <h2>Split a bill with {friend.name}</h2>

      <p>Bill value</p>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <p>Your expense</p>
      <input
        type="text"
        value={yourExpense}
        onChange={(e) =>
          setYourExpense(
            Number(e.target.value) > bill ? yourExpense : Number(e.target.value)
          )
        }
      />

      <p>
        <b>{friend.name}'s</b> expense
      </p>
      <input
        type="text"
        value={friendExpense > 0 ? friendExpense : ""}
        disabled
      />

      <p>Who is paying the bill</p>
      <select
        value={billPaying}
        onChange={(e) => setBillPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
