import { SortBy, type User } from "../types.d";

interface UsersTableProps {
  users: User[];
  colorTable: boolean;
  deleteUser: (uuid: string) => void;
  sortBy: (key: SortBy) => void;
}

const UsersTable = ({
  users,
  colorTable,
  deleteUser,
  sortBy,
}: UsersTableProps) => {
  return (
    <table width="100%">
      <thead>
        <tr>
          <th>Foto</th>
          <th onClick={() => sortBy(SortBy.NAME)}>Nombre</th>
          <th onClick={() => sortBy(SortBy.LAST)}>Apellido</th>
          <th onClick={() => sortBy(SortBy.COUNTRY)}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, index) => {
          const backgroundColor = index % 2 === 0 ? "#333" : "#555";
          const color = colorTable ? backgroundColor : "";
          return (
            <tr key={user.login.uuid} style={{ backgroundColor: color }}>
              <td>
                <img src={user.picture.thumbnail} alt="" />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => deleteUser(user.login.uuid)}>
                  Eliminar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UsersTable;
