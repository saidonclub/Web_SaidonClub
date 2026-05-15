// ============================================================
// PAGE: Wishlist
// PURPOSE: User favorites/wishlist page
// ============================================================

import WishlistClient from "./WishlistClient";

export const metadata = {
  title: "Mis Favoritos | SaidonClub",
  description: "Gestiona tus productos favoritos guardados",
};

export default function WishlistPage() {
  return <WishlistClient />;
}