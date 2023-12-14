import React from "react";
import { FaTrash } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { DELETE_CLIENT } from "../mutations/clientMutations";
import { GET_CLIENTS } from "../queries/clientQueries";
import { GET_PROJECTS } from "../queries/projectQueries";

const ClientRow = ({ client }) => {
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    variables: { id: client.id },
    // refetch the client so that the frontend can be updated without us refershing the page.
    // this will instantaneously delete the client and will refetch the remaining ones which are not deleted.
    // otherwise we would have to refresh the page to get the updated data on the frontend.
    refetchQueries: [{ query: GET_CLIENTS }, { query: GET_PROJECTS }],
    //  OR WE CAN UPDATE THE CACHE, SO THERE ARE TWO METHODS TO DO THIS -> 1) refetchQueris 2) update method
    // update(cache, { data: { deleteClient } }) {
    //   const { clients } = cache.readQuery({ query: GET_CLIENTS });
    //   cache.writeQuery({
    //     query: GET_CLIENTS,
    //     data: {
    //       clients: clients.filter((client) => client.id !== deleteClient.id),
    //     },
    //   });
    // },
  });

  // readQuery reads the current state of the cache. It queries the cache for data using the 'GET_CLIENTS' query.
  // writeQuery is used to update the cache with the modified data. It takes the 'get_clients' query and updates the "clients" data by filtering out the deleted client.

  return (
    <tr>
      <td>{client.name}</td>
      <td>{client.email}</td>
      <td>{client.phone}</td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={deleteClient}>
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default ClientRow;

// EXPLANATION OF HOW A CLIENT IS DELETED
/*

useMutation Hook:

The code uses the useMutation hook from Apollo Client to perform a mutation operation. In this case, the mutation is defined by the DELETE_CLIENT GraphQL mutation, and it takes an id variable as a parameter.
Mutation Variables:

The variables option is used to provide the necessary variables for the mutation. In this case, it includes the id of the client to be deleted.
Update Function:

The update option is a function that gets executed after the mutation is successfully completed. It receives two parameters: cache and the result of the mutation ({ data: { deleteClient } }).
Cache Reading:

The cache.readQuery method is used to read the current state of the cache. It queries the cache for data using the GET_CLIENTS query.
Cache Update:

The cache.writeQuery method is used to update the cache with the modified data. It takes the GET_CLIENTS query and updates the clients data by filtering out the deleted client. The new list of clients is obtained by filtering the existing list using clients.filter((client) => client.id !== deleteClient.id).
In summary, when the mutation is triggered and a client is deleted, the update function ensures that the local cache is updated to reflect the removal of the deleted client. This update helps in keeping the client data consistent on the client side without the need for a full page refresh. The alternative method mentioned in the comments involves using the refetchQueries option to refetch the entire list of clients after the deletion. However, the provided code opts for updating the cache manually for more control over the caching behavior.

*/
