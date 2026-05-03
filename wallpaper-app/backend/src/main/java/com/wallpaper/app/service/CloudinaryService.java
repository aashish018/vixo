package com.wallpaper.app.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.wallpaper.app.config.CloudinaryProperties;
import com.wallpaper.app.exception.CloudinaryOperationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final CloudinaryProperties properties;

    public CloudinaryUploadResult upload(MultipartFile file) {
        try {
            Map<?, ?> response = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", properties.folder(),
                    "resource_type", "image"
            ));
            return toResult(response);
        } catch (IOException exception) {
            throw new CloudinaryOperationException("Failed to upload image to Cloudinary", exception);
        }
    }

    public CloudinaryUploadResult upload(String sourceUrl) {
        try {
            Map<?, ?> response = cloudinary.uploader().upload(sourceUrl, ObjectUtils.asMap(
                    "folder", properties.folder(),
                    "resource_type", "image"
            ));
            return toResult(response);
        } catch (IOException exception) {
            throw new CloudinaryOperationException("Failed to import image into Cloudinary", exception);
        }
    }

    public void delete(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return;
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
        } catch (IOException exception) {
            throw new CloudinaryOperationException("Failed to delete image from Cloudinary", exception);
        }
    }

    private CloudinaryUploadResult toResult(Map<?, ?> response) {
        String publicId = String.valueOf(response.get("public_id"));
        String imageUrl = String.valueOf(response.get("secure_url"));
        String thumbnailUrl = cloudinary.url()
                .secure(true)
                .transformation(new Transformation<>()
                        .width(900)
                        .crop("limit")
                        .quality("auto")
                        .fetchFormat("auto"))
                .generate(publicId);
        return new CloudinaryUploadResult(imageUrl, thumbnailUrl, publicId);
    }

    public record CloudinaryUploadResult(String imageUrl, String thumbnailUrl, String publicId) {
    }
}
