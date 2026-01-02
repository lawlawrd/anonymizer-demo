import React, { useState, useCallback } from "react";
import { blockTypes, alignTypes, colorTypes } from "./editorUtils.js";

const EditorToolbar = ({
  editor,
  editorSize,
  activeBlock,
  activeAlign,
  setColorPickerActive,
  toolbarDisabled = false,
}) => {
  if (!editor) return "";

  const [imageDialogActive, setImageDialogActive] = useState(false);
  const [youtubeDialogActive, setYoutubeDialogActive] = useState(false);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const toolbarClassName = toolbarDisabled
    ? "editor-toolbar is-disabled"
    : "editor-toolbar";

  return [
    <div
      className={toolbarClassName}
      key="editor-toolbar"
      aria-disabled={toolbarDisabled}
    >
      {(editorSize == "large" || editorSize == "medium") && [
        <button
          key="undo-button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={toolbarDisabled || !editor.can().chain().focus().undo().run()}
        >
          <svg className="icon">
            <use xlinkHref="/images/icons.svg#undo" />
          </svg>
        </button>,
        <button
          key="redo-button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={toolbarDisabled || !editor.can().chain().focus().redo().run()}
        >
          <svg className="icon">
            <use xlinkHref="/images/icons.svg#redo" />
          </svg>
        </button>,
        <div key="undo-redo-divider" className="divider" />,
      ]}
      {(editorSize == "large" || editorSize == "medium") && [
        <div className="dropdown editor-block-types" key="editor-block-types">
          <button
            title={activeBlock && activeBlock.title ? activeBlock.title : ""}
            disabled={toolbarDisabled}
          >
            <svg className="icon">
              <use
                xlinkHref={`/images/icons.svg#${
                  activeBlock && activeBlock.slug ? activeBlock.slug : ""
                }`}
              />
            </svg>
            <span>
              {activeBlock && activeBlock.title ? activeBlock.title : ""}
            </span>
            <svg className="icon">
              <use xlinkHref="/images/icons.svg#chevron-down" />
            </svg>
          </button>
          <div className="panel arrow">
            <ul>
              {blockTypes &&
                blockTypes.length > 0 &&
                blockTypes.map((block) => (
                  <li
                    key={"block-type-" + block.slug}
                    className={block.slug == activeBlock.slug ? "active" : ""}
                  >
                    <a
                      tabIndex="0"
                      role="button"
                      onClick={() => block.toggle(editor)}
                    >
                      <svg className="icon">
                        <use
                          xlinkHref={`/images/icons.svg#${block.slug}`}
                        />
                      </svg>
                      {block.title}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>,
        <div className="divider" key="editor-block-divider" />,
      ]}

      <button
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          toolbarDisabled || !editor.can().chain().focus().toggleBold().run()
        }
        className={editor.isActive("bold") ? "active" : ""}
      >
        <svg className="icon">
          <use xlinkHref="/images/icons.svg#bold" />
        </svg>
      </button>
      <button
        title="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          toolbarDisabled || !editor.can().chain().focus().toggleItalic().run()
        }
        className={editor.isActive("italic") ? "active" : ""}
      >
        <svg className="icon">
          <use xlinkHref="/images/icons.svg#italic" />
        </svg>
      </button>
      {editorSize == "small" && (
        <button
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={
            toolbarDisabled ||
            !editor.can().chain().focus().toggleUnderline().run()
          }
          className={editor.isActive("underline") ? "active" : ""}
        >
          <svg className="icon">
            <use xlinkHref="/images/icons.svg#underline" />
          </svg>
        </button>
      )}

      {(editorSize == "large" || editorSize == "small") && (
        <button
          key="editor-link-button"
          title="Insert link"
          onClick={setLink}
          disabled={toolbarDisabled || !setLink}
          className={editor.isActive("link") ? "active" : ""}
        >
          <svg className="icon">
            <use xlinkHref="/images/icons.svg#link" />
          </svg>
        </button>
      )}

      {editorSize != "small" && (
        <div className="dropdown">
          <button title="More options" disabled={toolbarDisabled}>
            <svg className="icon">
              <use xlinkHref="/images/icons.svg#more-horizontal" />
            </svg>
          </button>
          <div className="panel arrow">
            <ul>
              <li className={editor.isActive("underline") ? "active" : ""}>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <svg className="icon">
                    <use xlinkHref="/images/icons.svg#underline" />
                  </svg>
                  Underline
                </a>
              </li>
              <li className={editor.isActive("strike") ? "active" : ""}>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                  <svg className="icon">
                    <use xlinkHref="/images/icons.svg#strikethrough" />
                  </svg>
                  Strikethrough
                </a>
              </li>
              <li className={editor.isActive("code") ? "active" : ""}>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                >
                  <svg className="icon">
                    <use xlinkHref="/images/icons.svg#format-code" />
                  </svg>
                  Code
                </a>
              </li>

              {editorSize == "medium" && (
                <li className={editor.isActive("link") ? "active" : ""}>
                  <a tabIndex="0" role="button" onClick={setLink}>
                    <svg className="icon">
                      <use xlinkHref="/images/icons.svg#link" />
                    </svg>
                    Link
                  </a>
                </li>
              )}
              {editorSize != "large" && [
                <li className="seperator" key="toolbar-dropdown-seperator" />,
                <li className="toolbar-colors" key="toolbar-dropdown-colors-1">
                  <a
                    tabIndex="0"
                    role="button"
                    onClick={() => setColorPickerActive("text-color")}
                  >
                    <svg className="icon">
                      <use xlinkHref="/images/icons.svg#color-text" />
                    </svg>
                    <span>Text color</span>
                    <div className="spacer" />
                    <span
                      className={`tag current-color ${
                        !editor.getAttributes("textStyle").color
                          ? "nothing"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          editor.getAttributes("textStyle").color,
                      }}
                    />
                  </a>
                </li>,
                <li className="toolbar-colors" key="toolbar-dropdown-colors-2">
                  <a
                    tabIndex="0"
                    role="button"
                    onClick={() => setColorPickerActive("highlight")}
                  >
                    <svg className="icon">
                      <use xlinkHref="/images/icons.svg#color-fill" />
                    </svg>
                    <span>Background color</span>
                    <div className="spacer" />
                    <span
                      className={`tag current-color ${
                        colorTypes.findIndex((c) =>
                          editor.isActive("highlight", { color: c.hex }),
                        ) == -1
                          ? "nothing"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          colorTypes.findIndex((c) =>
                            editor.isActive("highlight", { color: c.hex }),
                          ) == -1
                            ? ""
                            : colorTypes[
                                colorTypes.findIndex((c) =>
                                  editor.isActive("highlight", {
                                    color: c.hex,
                                  }),
                                )
                              ].hex,
                      }}
                    />
                  </a>
                </li>,
              ]}
            </ul>
          </div>
        </div>
      )}

      {editorSize == "small" && (
        <button
          onClick={() => setImageDialogActive(true)}
          disabled={toolbarDisabled}
        >
          <svg className="icon">
            <use xlinkHref={`/images/icons.svg#image`} />
          </svg>
        </button>
      )}

      {editorSize == "large" && [
        <div className="divider" key="button-color-divider" />,
        <button
          key={"editor-tooltip-text-color"}
          title="Text color"
          onClick={() => setColorPickerActive("text-color")}
          className="color-picker"
          disabled={toolbarDisabled}
        >
          <svg className="icon">
            <use xlinkHref="/images/icons.svg#color-text" />
          </svg>
          <span
            className={`tag current-color ${
              !editor.getAttributes("textStyle").color ? "nothing" : ""
            }`}
            style={{
              backgroundColor: editor.getAttributes("textStyle").color,
            }}
          />
        </button>,
        <button
          key={"editor-tooltip-highlight"}
          title="Text color"
          onClick={() => setColorPickerActive("highlight")}
          className="color-picker"
          disabled={toolbarDisabled}
        >
          <svg className="icon">
            <use xlinkHref="/images/icons.svg#color-fill" />
          </svg>
          <span
            className={`tag current-color ${
              colorTypes.findIndex((c) =>
                editor.isActive("highlight", { color: c.hex }),
              ) == -1
                ? "nothing"
                : ""
            }`}
            style={{
              backgroundColor:
                colorTypes.findIndex((c) =>
                  editor.isActive("highlight", { color: c.hex }),
                ) == -1
                  ? ""
                  : colorTypes[
                      colorTypes.findIndex((c) =>
                        editor.isActive("highlight", { color: c.hex }),
                      )
                    ].hex,
            }}
          />
        </button>,
      ]}

      {editorSize != "small" && [
        <div className="divider" key="yet-another-divider" />,
        <div
          className="dropdown"
          style={{ marginRight: ".5em" }}
          key="alignment-dropdown"
        >
          <button
            title={activeAlign && activeAlign.title ? activeAlign.title : ""}
            disabled={toolbarDisabled}
          >
            <svg className="icon">
              <use
                xlinkHref={`/images/icons.svg#${
                  activeAlign && activeAlign.slug ? activeAlign.slug : ""
                }`}
              />
            </svg>
          </button>
          <div className="panel arrow">
            <ul>
              {alignTypes &&
                alignTypes.length > 0 &&
                alignTypes.map((align) => (
                  <li
                    key={"align-type-" + align.slug}
                    className={align.slug == activeAlign.slug ? "active" : ""}
                  >
                    <a
                      tabIndex="0"
                      role="button"
                      onClick={() => align.toggle(editor)}
                    >
                      <svg className="icon">
                        <use
                          xlinkHref={`/images/icons.svg#${align.slug}`}
                        />
                      </svg>
                      {align.title}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>,
        <div className="dropdown" key="table-dropdown">
          <button title="Insert table" disabled={toolbarDisabled}>
            <svg className="icon">
              <use xlinkHref={`/images/icons.svg#table`} />
            </svg>
            <span>Table</span>
          </button>
          <div className="panel arrow">
            <ul>
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3 })
                      .run()
                  }
                >
                  Insert table
                </a>
              </li>
              <li className="seperator" />
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                >
                  Add column before
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                >
                  Add column after
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                >
                  Delete column
                </a>
              </li>
              <li className="seperator" />
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                >
                  Add row before
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                >
                  Add row after
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => editor.chain().focus().deleteRow().run()}
                >
                  Delete row
                </a>
              </li>
              <li className="seperator" />
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                >
                  Toggle header row
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => editor.chain().focus().mergeOrSplit().run()}
                >
                  Merge or split
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => setColorPickerActive("cell-color")}
                >
                  Cell background color
                </a>
              </li>
            </ul>
          </div>
        </div>,
        <div className="dropdown" key="media-dropdown">
          <button title="Insert media" disabled={toolbarDisabled}>
            <svg className="icon">
              <use xlinkHref={`/images/icons.svg#plus`} />
            </svg>
            <span>Insert</span>
          </button>
          <div className="panel arrow">
            <ul>
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => setImageDialogActive(true)}
                >
                  <svg className="icon">
                    <use xlinkHref={`/images/icons.svg#image`} />
                  </svg>
                  Image
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => setYoutubeDialogActive(true)}
                >
                  <svg className="icon">
                    <use xlinkHref={`/images/icons.svg#movie`} />
                  </svg>
                  YouTube
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() =>
                    editor.commands.insertContent(
                      `<ul data-type="taskList"><li data-type="taskItem" data-checked="true">A list item</li><li data-type="taskItem" data-checked="false">And another one</li></ul>`,
                    )
                  }
                >
                  <svg className="icon">
                    <use xlinkHref={`/images/icons.svg#checklist`} />
                  </svg>
                  Task list
                </a>
              </li>
            </ul>
          </div>
        </div>,
      ]}
    </div>,
    <ImageDialog
      key="image-dialog"
      {...{ editor, imageDialogActive, setImageDialogActive }}
    />,
    <YoutubeDialog
      key="youtube-dialog"
      {...{ editor, youtubeDialogActive, setYoutubeDialogActive }}
    />,
    <div
      key="editor-toolbar-backdrop"
      className="backdrop"
      style={{
        zIndex: 100148,
        display: imageDialogActive || youtubeDialogActive ? "block" : "none",
      }}
      onClick={() => {
        setImageDialogActive(false);
        setYoutubeDialogActive(false);
      }}
    />,
  ];
};

const ImageDialog = ({ editor, imageDialogActive, setImageDialogActive }) => {
  const [imgUrl, setImgUrl] = useState("");
  const [addImage, setAddImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const [altText, setAltText] = useState("");
  const [titleText, setTitleText] = useState("");

  const uploadFile = async (e, filetype) => {
    if (e.target.files && e.target.files[0]) {
      setAddImage(e.target.files[0]);
      setUploadingImage(true);

      if (e.target.files[0].type.indexOf("image") == -1) {
        setUploadingImage(false);
      } else {
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        const uploadedImage = await fetch(
          "/api/collections/upload/" + filetype,
          {
            method: "PUT",
            body: formData,
          },
        )
          .then((res) => res.json())
          .then((json) => json)
          .catch((err) => console.log(err));

        if (
          uploadedImage &&
          uploadedImage.fileName &&
          uploadedImage.folderLocation
        ) {
          setImagePreview(uploadedImage);
          setImgUrl("");
        }
      }
    }
  };

  return (
    <dialog className="image-dialog" open={imageDialogActive}>
      <a
        className="control close"
        tabIndex="0"
        onClick={() => {
          setImagePreview(false);
          setAltText("");
          setImgUrl("");
          setTitleText("");
          setImageDialogActive(false);
        }}
      >
        <svg className="icon">
          <use xlinkHref="/images/icons.svg#clear"></use>
        </svg>
      </a>
      <h4>Insert image</h4>

      <div className="basic-form">
        <label htmlFor="images-upload">Upload</label>
        <div style={{ display: "flex" }}>
          <input
            type="file"
            name="images-upload"
            onChange={(e) => uploadFile(e, "images")}
            accept="image/*"
            id="images-upload"
          />
          <label
            htmlFor="images-upload"
            className="button"
            style={{ padding: "0px 1.4em 5px 1.1em" }}
          >
            <svg className="icon">
              <use xlinkHref="/images/icons.svg#images"></use>
            </svg>
          </label>

          <div className="group" style={{ width: "100%" }}>
            <input
              type="text"
              className={`append-icon ${
                addImage &&
                addImage.type &&
                addImage.type.indexOf("image") == -1
                  ? "invalid"
                  : ""
              }`}
              placeholder="Upload image"
              value={
                addImage && addImage.type && addImage.name && addImage.size
                  ? `${addImage.name} (${addImage.type} / ${(
                      addImage.size / 1000
                    ).toFixed(2)}kb)`
                  : ""
              }
              readOnly={true}
            />
            {uploadingImage ? (
              <svg className="icon uploading">
                <use xlinkHref="/images/icons.svg#refresh"></use>
              </svg>
            ) : addImage &&
              addImage.type &&
              addImage.type.indexOf("image") == -1 ? (
              <svg className="icon" style={{ fill: "#f00" }}>
                <use xlinkHref="/images/icons.svg#warning"></use>
              </svg>
            ) : (
              <svg className="icon">
                <use xlinkHref="/images/icons.svg#upload"></use>
              </svg>
            )}
          </div>
        </div>
        <label htmlFor="image-url">URL</label>
        <input
          type="url"
          id="image-url"
          placeholder="Link to image, https://example.com/picture.jpg"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
        />
      </div>
      <div className="image-preview">
        {imagePreview ? (
          <img src={`${imagePreview.folderLocation}${imagePreview.fileName}`} />
        ) : imgUrl ? (
          <img src={imgUrl} />
        ) : (
          <div className="no-images">Image preview</div>
        )}
        <div className="additional-options">
          <label htmlFor="alt-text">Alt text</label>
          <input
            disabled={!imagePreview && !imgUrl}
            type="text"
            id="alt-text"
            placeholder="Textual replacement for the image, for accessibility"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />

          <label htmlFor="title-text">Title text</label>
          <input
            type="text"
            id="title-text"
            disabled={!imagePreview && !imgUrl}
            placeholder="Supplemental captioning information"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
          />
        </div>
      </div>

      <footer>
        <div className="spacer" />
        <button
          onClick={() => {
            setImagePreview(false);
            setAltText("");
            setTitleText("");
            setImgUrl("");
            setImageDialogActive(false);
          }}
        >
          Cancel
        </button>

        <button
          className="primary"
          disabled={!imagePreview && !imgUrl}
          onClick={async () => {
            let imgObj = {
              src: imagePreview
                ? imagePreview.folderLocation + imagePreview.fileName
                : imgUrl && imgUrl.length > 0
                  ? imgUrl
                  : "",
            };
            if (altText && altText.length > 0) imgObj["alt"] = altText;
            if (titleText && titleText.length > 0) imgObj["title"] = titleText;

            editor.commands.setImage(imgObj);

            setImagePreview(false);
            setAltText("");
            setTitleText("");
            setImgUrl("");
            setImageDialogActive(false);
          }}
        >
          Insert image
        </button>
      </footer>
    </dialog>
  );
};

const YoutubeDialog = ({
  editor,
  youtubeDialogActive,
  setYoutubeDialogActive,
}) => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [youtubeWidth, setYoutubeWidth] = useState("");
  const [youtubeHeight, setYoutubeHeight] = useState("");

  return (
    <dialog className="youtube-dialog" open={youtubeDialogActive}>
      <a
        className="control close"
        tabIndex="0"
        onClick={() => {
          setYoutubeLink("");
          setYoutubeHeight("");
          setYoutubeWidth("");
          setYoutubeDialogActive(false);
        }}
      >
        <svg className="icon">
          <use xlinkHref="/images/icons.svg#clear"></use>
        </svg>
      </a>
      <h4>Insert YoutTube video:</h4>
      <div className="basic-form">
        <label htmlFor="youtube-link">Link</label>
        <input
          type="url"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        />
        <label htmlFor="youtube-width">Width</label>
        <input
          type="number"
          value={youtubeWidth}
          onChange={(e) => setYoutubeWidth(e.target.value)}
          placeholder="640"
          style={{ gridColumnEnd: "-8" }}
        />
        <label htmlFor="youtube-height">Height</label>
        <input
          type="number"
          value={youtubeHeight}
          onChange={(e) => setYoutubeHeight(e.target.value)}
          placeholder="480"
          style={{ gridColumnEnd: "-8" }}
        />
      </div>

      <footer>
        <div className="spacer" />
        <button
          onClick={() => {
            setYoutubeLink("");
            setYoutubeHeight("");
            setYoutubeWidth("");
            setYoutubeDialogActive(false);
          }}
        >
          Cancel
        </button>

        <button
          className="primary"
          disabled={!youtubeLink || youtubeLink.length < 20}
          onClick={async () => {
            let youtubeObj = {
              src: youtubeLink,
            };
            if (youtubeWidth && !isNaN(youtubeWidth))
              youtubeObj["width"] = Number(youtubeWidth);
            if (youtubeHeight && !isNaN(youtubeHeight))
              youtubeObj["height"] = Number(youtubeHeight);

            editor.commands.setYoutubeVideo(youtubeObj);

            setYoutubeLink("");
            setYoutubeHeight("");
            setYoutubeWidth("");
            setYoutubeDialogActive(false);
          }}
        >
          Insert video
        </button>
      </footer>
    </dialog>
  );
};

export default EditorToolbar;
