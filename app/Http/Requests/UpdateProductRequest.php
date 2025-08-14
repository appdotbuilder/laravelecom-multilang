<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $productId = $this->route('product')->id;

        return [
            'category_id' => 'required|exists:categories,id',
            'name_en' => 'required|string|max:255',
            'name_id' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $productId,
            'description_en' => 'nullable|string',
            'description_id' => 'nullable|string',
            'short_description_en' => 'nullable|string',
            'short_description_id' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'sku' => 'required|string|max:255|unique:products,sku,' . $productId,
            'stock_quantity' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'string|url',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'Selected category is invalid.',
            'name_en.required' => 'English product name is required.',
            'name_id.required' => 'Indonesian product name is required.',
            'slug.required' => 'Product slug is required.',
            'slug.unique' => 'This slug is already taken by another product.',
            'base_price.required' => 'Product price is required.',
            'base_price.min' => 'Price must be at least 0.',
            'sku.required' => 'SKU is required.',
            'sku.unique' => 'This SKU is already taken by another product.',
            'stock_quantity.required' => 'Stock quantity is required.',
            'stock_quantity.min' => 'Stock quantity must be at least 0.',
        ];
    }
}