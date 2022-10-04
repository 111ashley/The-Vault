import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";

function PostItem({ post, id, onEdit, onDelete }) {
  return (
    <li className="categoryPost">
      <Link to={`/category/${post.type}/${id}`} className="categoryPostLink">
        <img
          src={post.imageUrls[0]}
          alt={post.name}
          className="categoryPostImg"
        />
        <div className="categoryPostDetails">
          <p className="categoryPostName">{post.name}</p>
        </div>
      </Link>

      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231,76,60)"
          onClick={() => onDelete(post.id, post.name)}
        />
      )}
      {onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
    </li>
  );
}

export default PostItem;
