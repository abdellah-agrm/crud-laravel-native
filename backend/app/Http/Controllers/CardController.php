<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CardController extends Controller
{
  // Get all cards
  public function index()
  {
    return response()->json(Card::all());
  }

  // Create a new card
  public function store(Request $request)
  {
      $request->validate([
          'title' => 'required|string|max:255',
          'details' => 'required|string',
          'image' => 'nullable|string'
      ]);
  
      $imagePath = null;
      if ($request->image) {
          $image = $request->image;
          $image = str_replace('data:image/jpeg;base64,', '', $image);
          $image = str_replace(' ', '+', $image);
          $imageName = time() . '.jpeg';
          Storage::disk('public')->put('images/' . $imageName, base64_decode($image));
          $imagePath = 'images/' . $imageName;
      }
  
      $card = Card::create([
          'title' => $request->title,
          'details' => $request->details,
          'active' => $request->active ?? true,
          'image' => $imagePath,
      ]);
  
      return response()->json($card, 201);
  }

  // Show a single card
  public function show($id)
  {
    $card = Card::findOrFail($id);
    return response()->json($card);
  }

  // Update an existing card
  public function update(Request $request, Card $card)
  {
      $request->validate([
          'title' => 'required|string|max:255',
          'details' => 'required|string',
          'image' => 'nullable|string'
      ]);
  
      $data = $request->only(['title', 'details', 'active']);
  
      if ($request->image) {
          if ($card->image) {
              Storage::disk('public')->delete($card->image);
          }
          
          $image = $request->image;
          $image = str_replace('data:image/jpeg;base64,', '', $image);
          $image = str_replace(' ', '+', $image);
          $imageName = time() . '.jpeg';
          Storage::disk('public')->put('images/' . $imageName, base64_decode($image));
          $data['image'] = 'images/' . $imageName;
      }
  
      $card->update($data);
  
      return response()->json($card);
  }

  // Delete a card
  public function destroy($id)
  {
    $card = Card::findOrFail($id);

    // Delete the image file if it exists
    if ($card->image && Storage::exists('public/' . $card->image)) {
      Storage::delete('public/' . $card->image);
    }

    // Delete the card record
    $card->delete();

    return response()->json(null, 204);
  }
}
