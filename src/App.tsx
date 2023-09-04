import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { type User, SortBy } from "./types.d";
import UsersTable from "./components/UsersTable";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [colorTable, setColorTable] = useState(false);
  const [filterText, setFilterText] = useState<string | null>(null);
  const [sortByColumn, setSortByColumn] = useState<SortBy>(SortBy.NONE);
  const originalUsers = useRef<User[]>([]);

  const handleColorChange = () => setColorTable(!colorTable);

  const handleReset = () => {
    setUsers(originalUsers.current);
  };

  const deleteUser = (uuid: string) => {
    const notDeletedUsers = users.filter((user) => user.login.uuid !== uuid);
    setUsers(notDeletedUsers);
  };

  const sortBy = (key: SortBy) => {
    sortByColumn === key ? setSortByColumn(SortBy.NONE) : setSortByColumn(key);
  };

  const filteredUsers = useMemo(() => {
    return filterText
      ? users.filter((user) => {
          return user.location.country
            .toLocaleLowerCase()
            .includes(filterText.toLocaleLowerCase());
        })
      : users;
  }, [filterText, users]);

  const sortedUsers = useMemo(() => {
    if (sortByColumn === SortBy.NONE) return filteredUsers;

    const compareProperties: Record<string, (user: User) => string> = {
      [SortBy.COUNTRY]: (user) => user.location.country,
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last,
    };

    return [...filteredUsers].sort((a, b) => {
      const extractProperty = compareProperties[sortByColumn];

      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredUsers, sortByColumn]);

  useEffect(() => {
    fetch("https://randomuser.me/api/?page=1&results=100&seed=abc")
      .then(async (res) => await res.json())
      .then((data) => {
        setUsers(data.results);
        originalUsers.current = data.results;
      });
  }, []);

  return (
    <>
      <h1>Prueba técnica React + TS</h1>
      <header>
        <button onClick={handleColorChange}>
          {colorTable ? "Descolorear" : "Colorear"}
        </button>
        <button onClick={() => sortBy(SortBy.COUNTRY)}>
          {sortByColumn === SortBy.COUNTRY
            ? "Orden Original"
            : "Ordenar por país"}
        </button>
        <button onClick={handleReset}>Restaurar Estado</button>
        <input
          type="text"
          placeholder="filter by country"
          onChange={(e) => setFilterText(e.target.value)}
        />
      </header>
      <main>
        <UsersTable
          users={sortedUsers}
          colorTable={colorTable}
          deleteUser={deleteUser}
          sortBy={sortBy}
        />
      </main>
    </>
  );
}

export default App;
