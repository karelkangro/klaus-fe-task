<template>
  <modal
    :isOpen="isUserEdited || isAllUsersEdited"
    @closeModal="closeModal"
    closeButtonLabel="Save and close"
  >
    <div v-if="isUserEdited" class="edit-user">
      <span>
        <label for="user-id">Id:</label>
        <input name="user-id" v-model="user.id" />
      </span>
      <span>
        <label for="user-name">Name:</label>
        <input name="user-name" v-model="user.name" />
      </span>
      <span>
        <label for="user-email">E-mail:</label>
        <input name="user-email" v-model="user.email" />
      </span>
      <span>
        <label for="user-role">Role:</label>
        <select name="user-role" v-model="user.role">
          <option disabled value="">Please select one</option>
          <option>ADMIN</option>
          <option>AGENT</option>
          <option>EXTERNAL_REVIEWER</option>
          <option>ACCOUNT_MANAGER</option>
        </select>
      </span>
      <span>
        <label for="user-avatar">Avatar:</label>
        <input name="user-avatar" v-model="user.avatar" />
      </span>
    </div>

    <div
      v-if="isAllUsersEdited"
      :class="['edit-user', { 'edit-user--bulk': isAllUsersEdited }]"
    >
      <div class="edit-user__header">
        <p>Show users from:</p>
        <input type="text" v-model="filterUsers.from" /> to:
        <input type="text" v-model="filterUsers.to" />
        <button @click="closeModal" class="button button--square">Close</button>
      </div>
      <ul class="edit-user__list">
        <li v-for="user in selectedUsers" :key="user.id" class="user">
          <div class="user__info">
            <img class="user__image" :src="user.avatar" alt="user avatar" />
            <div class="user__details">
              <span>{{ user.name }}</span>
              <span>{{ user.email }}</span>
            </div>
          </div>
          <div class="user__role">
            <button-role :role="user.role" />
          </div>
          <div class="user__actions">
            <button-action name="Edit" @click="editUser(user)">
              <icon-edit />
            </button-action>
            <button-action square @click="deleteUser(user)">
              <icon-delete />
            </button-action>
          </div>
        </li>
      </ul>
      <p>Total users: {{ users.length }}</p>
    </div>
  </modal>
  <div class="meowbar">
    <h1 class="meowbar__title">Account users</h1>
    <div class="meowbar__actions">
      <div class="meowbar__search">
        <icon-search />
        <input
          type="text"
          name="meowbar-search"
          v-model="searchQuery"
          placeholder="Search"
        />
      </div>
      <button class="meowbar__button">Connect users</button>
    </div>
  </div>
  <div class="users">
    <div class="users__action-bar">
      <span>{{ selectedUsersCount }}</span>
      <span>{{ selectedUsersLabel }} selected</span>
      <button-action name="Edit" @click="editSelectedUsers">
        <icon-edit />
      </button-action>
      <button-action name="Delete" @click="deleteAllCheckedUsers">
        <icon-delete />
      </button-action>
    </div>

    <div v-if="!users.length">loading users ...</div>

    <ul v-if="users.length" class="users__list">
      <li v-if="visibleUsers.length" class="user">
        <label class="checkbox">
          <span v-show="!searchQuery" class="checkbox__input">
            <input
              type="checkbox"
              name="user"
              v-model="isVisibleUsersChecked"
            />
            <span class="checkbox__control">
              <icon-check />
            </span>
          </span>
        </label>
        <div></div>
        <div class="user__role">
          <button @click="isUsersFilteredByRole = !isUsersFilteredByRole">
            Permission
            <icon-arrow-down />
          </button>
        </div>
        <div></div>
      </li>

      <li
        v-for="user in visibleUsers"
        :key="user.id"
        :class="['user', { 'user--is-selected': isUserSelected(user.id) }]"
      >
        <label class="checkbox">
          <span class="checkbox__input">
            <input
              type="checkbox"
              name="checkbox"
              v-model="selectedUserIDs"
              :id="user.id"
              :value="user.id"
            />
            <span class="checkbox__control">
              <icon-check />
            </span>
          </span>
        </label>

        <div class="user__info">
          <img class="user__image" :src="user.avatar" alt="user avatar" />
          <div class="user__details">
            <span>{{ user.name }}</span>
            <span>{{ user.email }}</span>
          </div>
        </div>
        <div class="user__role">
          <button-role :role="user.role" />
        </div>
        <div class="user__actions">
          <button-action name="Edit" @click="editUser(user)">
            <icon-edit />
          </button-action>
          <button-action square @click="deleteUser(user)">
            <icon-delete />
          </button-action>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive, toRefs, computed, watch, onMounted } from "vue";
// Components
import Modal from "@/components/Modal";
import ButtonAction from "@/components/ButtonAction";
import ButtonRole from "@/components/ButtonRole";
// Icons
import IconEdit from "@/assets/icons/edit.svg";
import IconDelete from "@/assets/icons/delete.svg";
import IconCheck from "@/assets/icons/check.svg";
import IconSearch from "@/assets/icons/search.svg";
import IconArrowDown from "@/assets/icons/arrow-down.svg";
// Utils
import { sortArrayByObjectKeys } from "@/utils";

export default {
  name: "Home",
  components: {
    Modal,
    ButtonAction,
    ButtonRole,
    IconEdit,
    IconDelete,
    IconCheck,
    IconSearch,
    IconArrowDown
  },
  setup() {
    const state = reactive({
      user: {},
      users: [],
      searchQuery: "",
      selectedUserIDs: [],
      isUserEdited: false,
      isAllUsersEdited: false,
      isVisibleUsersChecked: false,
      isUsersFilteredByRole: false,
      filterUsers: {
        from: 0,
        to: 10
      },
      showUsers: {
        from: 0,
        to: 10
      },
      visibleUsers: computed(() => {
        if (!state.users) return;

        const list = state.users.slice(
          state.showUsers.from,
          state.showUsers.to
        );

        if (state.searchQuery)
          list.filter(user =>
            user.name.toLowerCase().includes(state.searchQuery.toLowerCase())
          );

        if (state.isUsersFilteredByRole)
          return sortArrayByObjectKeys([...list], "role");

        return list;
      }),
      selectedUsers: computed(() =>
        state.users.filter(user => [...state.selectedUserIDs].includes(user.id))
      ),
      selectedUsersCount: computed(() =>
        state.selectedUsers.length ? state.selectedUsers.length : 0
      ),
      selectedUsersLabel: computed(() =>
        state.selectedUsersCount < 1 || state.selectedUsersCount > 1
          ? "users"
          : "user"
      )
    });

    const clearUsersSelected = () => (state.selectedUserIDs = []);

    const selectUsers = () => {
      if (!state.users) return;

      if (
        state.isVisibleUsersChecked &&
        (!state.selectedUserIDs.length || state.selectedUserIDs.length !== 0)
      ) {
        state.selectedUserIDs = state.visibleUsers.map(user => user.id);

        return;
      }

      if (!state.isVisibleUsersChecked && state.selectedUserIDs.length !== 0) {
        clearUsersSelected();

        return;
      }

      if (
        !state.isVisibleUsersChecked &&
        state.selectedUserIDs.length !== 0 &&
        state.selectedUserIDs.length === state.users.length
      ) {
        clearUsersSelected();

        return;
      }
    };

    const isUserSelected = id => state.selectedUserIDs.includes(id);

    const setVisibleUsersRange = () => {
      state.showUsers.to = state.filterUsers.to;
      state.showUsers.from = state.filterUsers.from;
    };

    const closeModal = () => {
      if (state.isUserEdited) state.isUserEdited = false;
      if (state.isAllUsersEdited) {
        state.isAllUsersEdited = false;
        setVisibleUsersRange();
      }
    };

    const editUser = user => {
      state.isUserEdited = true;
      state.user = user;
    };

    const editSelectedUsers = () => {
      state.isAllUsersEdited = true;
    };

    const deleteUser = user => {
      if (
        confirm(
          `Are you sure to delete ${
            typeof user === "number" ? `ID: ${user}` : user.name
          } ⁉️ 🙀 MEOWWWWW 🙀`
        )
      ) {
        state.users = state.users.filter(item => item.id !== user.id);
        state.selectedUserIDs = state.selectedUserIDs.filter(
          id => id !== user.id
        );
      }
      return;
    };

    const deleteAllCheckedUsers = () => {
      if (state.isVisibleUsersChecked) {
        state.users = state.users.filter(
          user => ![...state.selectedUserIDs].includes(user.id)
        );
        state.isVisibleUsersChecked = false;
      }
    };

    const fetchUsersFromAPI = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/klausapp/frontend-engineer-test-task/master/users.json"
        );
        const data = await response.json();
        state.users = data.users;
      } catch (error) {
        console.log("error.message", error.message);
      }
    };

    onMounted(fetchUsersFromAPI());

    watch(
      () => state.isVisibleUsersChecked,
      () => selectUsers()
    );

    return {
      ...toRefs(state),
      isUserSelected,
      editUser,
      editSelectedUsers,
      deleteUser,
      deleteAllCheckedUsers,
      closeModal
    };
  }
};
</script>

<style lang="scss">
.meowbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: var(--space-0-75);
  width: 44.75rem;
  padding: 0;

  &__actions {
    display: flex;
    margin-left: auto;
  }

  &__search {
    margin-right: var(--space-0-75);
    width: 12.75rem;
    height: var(--space-2-5);
    border-radius: var(--border-radius-4);
    border: 0.0625rem solid var(--color-gray);
    display: flex;
    align-items: center;
    position: relative;

    svg {
      position: absolute;
      margin-left: var(--space-1);
    }

    input {
      height: var(--space-2-5);
      width: 100%;
      padding-left: var(--space-2-5);
      border-top-style: hidden;
      border-right-style: hidden;
      border-left-style: hidden;
      border-bottom-style: hidden;
      background-color: white;
    }
  }

  &__button {
    font-size: var(--text-sm);
    font-weight: 500;
    background: var(--brand-50);
    min-width: 7.625rem;
    height: var(--space-2-5);
    color: white;
    border: none;
    border-radius: var(--border-radius-4);
  }
}

.checkbox {
  display: grid;
  grid-template-columns: min-content auto;
  grid-gap: var(--space-0-25);
  justify-content: center;
  font-size: var(--text-xs);

  &--disabled {
    color: var(--disabled);
  }

  &__control {
    display: inline-grid;
    width: var(--space-1);
    height: var(--space-1);
    border-radius: var(--border-radius-4);
    border: 0.0625rem solid var(--gray-40);

    svg {
      opacity: 0;
    }
  }

  &__input {
    display: grid;
    grid-template-areas: "checkbox";

    > * {
      grid-area: checkbox;
    }
  }

  input {
    opacity: 0;
    width: var(--space-0-5);
    height: var(--space-0-5);

    &:checked + .checkbox__control svg {
      opacity: 1;
      background: var(--brand-50);
      width: var(--space-1);
      height: var(--space-1);
      border-radius: var(--border-radius-4);
      border: solid 0.0625rem var(--brand-50);
      color: white;
      margin-left: -0.0625rem;
      margin-top: -0.0625rem;
    }

    &:disabled + .checkbox__control {
      color: var(--disabled);
    }
  }
}

.users {
  background: white;
  width: 44.75rem;
  border-radius: var(--border-radius-8);
  padding-top: var(--space-1-5);
  padding-bottom: var(--space-0-25);

  &__action-bar {
    display: flex;
    align-items: center;
    margin-left: var(--space-2);
    margin-bottom: var(--space-1-5);

    span:not(:first-child) {
      margin-left: var(--space-0-25);
      margin-right: var(--space-1-5);
    }

    input {
      width: 2rem;
    }
  }

  &__list {
    li:first-child {
      height: var(--space-1);
      margin-bottom: var(--space-0-5);

      &:hover {
        background: transparent;
        border-left: var(--space-0-25) solid transparent;
      }

      & .user__role button {
        border: none;
        background: none;
        color: var(--gray-60);
        font-size: var(--text-xs);
        display: flex;
        align-items: center;
        margin-left: -0.25rem;
        cursor: pointer;

        & svg {
          margin-left: var(--space-0-25);
        }
      }
    }
  }
}

.user {
  display: grid;
  width: 42.75rem;
  margin-left: var(--space-1);
  margin-right: var(--space-1);
  grid-template-columns: var(--space-2-5) 22.5rem 9.3125rem 1fr;
  align-items: center;
  height: var(--space-4);
  border-radius: var(--border-radius-4);
  border-left: var(--space-0-25) solid transparent;
  margin-bottom: var(--space-0-25);
  cursor: pointer;

  &--is-selected {
    background: var(--gray-10);
    border-left: var(--space-0-25) solid var(--brand-50);
  }

  &__checkbox {
    margin-left: var(--space-0-75);
    margin-right: var(--space-0-75);
    width: var(--space-1);
    height: var(--space-1);

    &:checked {
      background-color: var(--brand-50);
    }
  }

  &__info {
    display: flex;
    align-items: center;
    /* background: lightgreen; */
  }

  &__image {
    width: var(--space-2);
    height: var(--space-2);
    border-radius: 50%;
    margin-right: var(--space-0-75);
  }

  &__details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    span {
      font-size: var(--text-xs);
      color: var(--gray-90);
      margin-bottom: var(--space-0-5);

      &:last-child {
        color: var(--gray-60);
      }
    }
  }

  &__role {
    display: flex;
  }

  &__actions {
    display: flex;
  }
}

.edit-user {
  span {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: var(--space-1);

    label {
      margin-right: var(--space-1);
      width: 20%;
    }
  }

  input,
  select {
    height: var(--space-2-5);
    border-radius: var(--border-radius-4);
    border: 0.0625rem solid rgba(128, 128, 128, 0.2);
    width: 100%;
    padding-left: var(--space-1);
  }

  &--bulk {
    input {
      width: var(--space-5);
    }

    .user {
      grid-template-columns: 15rem 8rem 7rem;
      margin-left: 0;
    }
  }

  &__header {
    display: grid;
    grid-template-columns: 4fr 2fr 1fr 3fr 1fr;
    align-items: center;
  }

  &__list {
    margin-top: var(--space-1-5);
  }
}
</style>
