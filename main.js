const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const itemContainer = $(".item-container");
const addBtn = $(".add-btn");
const clearBtn = $(".clear-btn");
const input = $(".input");
const checkAll = $(".check-all");

const app = {
  listData: [],
  isEdit: false,
  editData: {
    content: "",
    isComplete: false,
    id: -1,
  },

  handleEvent: function () {
    // click add button
    addBtn.onclick = () => {
      if (input.value === "") return alert("please input!");
      if (!this.isEdit) {
        const newItem = {
          content: input.value,
          isComplete: false,
        };
        this.listData.push(newItem);
      } else {
        let id = this.editData.id;
        this.listData[id].content = input.value;
        this.listData[id].isComplete = this.editData.isComplete;
        addBtn.innerText = "Add";
      }
      input.value = "";
      this.render();
    };

    // click item
    itemContainer.onclick = (e) => {
      // click delete-button
      if (e.target.classList.contains("delete-btn")) {
        e.preventDefault();

        const id = e.target.dataset.id;
        this.listData.splice(id, 1);
        this.render();
        return;
      }

      // click edit-button
      if (e.target.classList.contains("edit-btn")) {
        e.preventDefault();
        const id = e.target.dataset.id;
        const item = this.listData[id];
        input.value = item.content;
        this.isEdit = true;
        addBtn.innerText = "Edit";
        this.editData.content = item.content;
        this.editData.isComplete = item.isComplete;
        this.editData.id = id;
        return;
      }

      // click checkbox
      if (e.target.classList.contains("check-box")) {
        const id = e.target.dataset.id;
        this.listData[id].isComplete = !this.listData[id].isComplete;
        this.render();
        return;
      }
    };

    // click all-button
    checkAll.onchange = (e) => {
      if (checkAll.checked) {
        this.listData.forEach((item) => {
          item.isComplete = true;
        });
        this.render();
        return;
      } else {
        this.listData.forEach((item) => {
          item.isComplete = false;
        });
        this.render();
      }
    };

    // click clear-button
    clearBtn.onclick = () => {
      const newList = this.listData.filter((item) => {
        return !item.isComplete;
      });
      this.listData = newList;
      this.render();
    };
  },

  render: function () {
    const createItems = this.listData
      .map((e, i) => {
        const item = `
        <li class="item item-data" data-id="${i}">
          <div>
            <input class="check-box" id=${i} data-id="${i}" type="checkbox" ${
          e.isComplete ? "checked" : ""
        }>
            <label for="${i}" class="${e.isComplete ? "done" : ""}">${
          e.content
        }</label>
          </div>
          <div>
            <a href="" class="edit-btn" data-id="${i}">Edit</a>
            <a href="" class="delete-btn" data-id="${i}">Delete</a>
          </div>
        </li>
      `;
        return item;
      })
      .join("");
    itemContainer.innerHTML = createItems;

    this.saveStorage(this.listData);
  },

  saveStorage: function (data) {
    const dataString = JSON.stringify(data);
    localStorage.setItem("my-to-do-data", dataString);
  },
  getData: function () {
    const dataString = localStorage.getItem("my-to-do-data");
    if (dataString) this.listData = JSON.parse(dataString);
  },

  start: function () {
    // load data from local storage
    this.getData();

    // render
    this.render();

    // handleEvent
    this.handleEvent();
  },
};
app.start();
