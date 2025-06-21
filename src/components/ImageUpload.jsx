import React from "react";

const ImageUpload = ({ imagePreview, handleImageChange, bio, onBioChange }) => (
  <div className=" w-full lg:w-48 text-center mt-[5%]">
    <div className="flex items-center w-full lg:w-40 justify-center m-auto">
      <label className="w-32 h-32 bg-[#000000] rounded-full flex items-center justify-center text-white cursor-pointer">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-sm font-medium mb-2 text-center">
            Upload <br /> your image
          </span>
        )}
        <input type="file" className="hidden" onChange={handleImageChange} />
      </label>
    </div>
    <p className="text-[10px] text-black bg-white w-[100px] m-auto font-medium mt-1">
      Accepted Format png, jpeg max file; 100kb
    </p>

    <textarea
      name="bio"
      value={bio}
      onChange={onBioChange}
      type="text"
      placeholder="Write short Bio about yourself"
      className="w-full lg:w-44 bg-[#F5F5F5] text-center h-28 font-medium text-[10px] mt-2"
    >
    </textarea>

    {/* <input
      name="bio"
      value={bio}
      onChange={onBioChange}
      type="text"
      placeholder="Write short Bio about yourself"
      className="w-full lg:w-44 bg-[#F5F5F5] text-center h-28 font-medium text-[10px] mt-2"
    /> */}
  </div>
);

export default ImageUpload;
