import { shallowMount } from "@vue/test-utils";
import ButtonAction from "@/components/ButtonAction.vue";
import ButtonRole from "@/components/ButtonRole.vue";
import Modal from "@/components/Modal.vue";

describe("ButtonAction.vue", () => {
  it("renders name prop when passed", () => {
    const name = "Send";
    const wrapper = shallowMount(ButtonAction, {
      props: { name }
    });
    expect(wrapper.text()).toMatch(name);
  });

  it("renders props.msg when passed", () => {
    const wrapper = shallowMount(ButtonAction, {
      props: { square: true }
    });
    expect(wrapper.classes()).toContain("button--square");
  });
});

describe("ButtonRole.vue", () => {
  const roles = [
    {
      name: "ADMIN",
      class: "button-role--admin"
    },
    {
      name: "AGENT",
      class: "button-role--agent"
    },
    {
      name: "ACCOUNT_MANAGER",
      class: "button-role--account"
    },
    {
      name: "EXTERNAL_REVIEWER",
      class: "button-role--external"
    }
  ];

  roles.forEach(role => {
    it(`renders role prop ${role.name} when passed`, () => {
      const wrapper = shallowMount(ButtonRole, {
        props: { role: role.name }
      });
      expect(wrapper.classes()[1]).toEqual(role.class);
    });
  });
});

describe("Modal.vue", () => {
  it("renders nothing when isOpen prop is false", () => {
    const wrapper = shallowMount(Modal, {
      props: { isOpen: false }
    });
    expect(wrapper.html()).toBe("<!--v-if-->");
  });

  it("renders modal when isOpen prop is true", () => {
    const wrapper = shallowMount(Modal, {
      props: { isOpen: true }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders closeButtonLabel prop when passed", () => {
    const name = "Send";
    const wrapper = shallowMount(Modal, {
      props: { closeButtonLabel: name, isOpen: true }
    });
    expect(wrapper.find("button").text()).toEqual(name);
  });

  it("emits close-modal event when close button is pressed", async () => {
    const name = "Send";
    const closeModal = jest.fn();
    const wrapper = shallowMount(Modal, {
      props: { closeButtonLabel: name, isOpen: true, closeModal }
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("close-modal")).toHaveLength(1);
  });
});
