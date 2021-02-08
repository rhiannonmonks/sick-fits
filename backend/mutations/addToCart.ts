import { KeystoneContext, SessionStore } from '@keystone-next/types';
import { CartItem } from '../schemas/CartItem';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

async function addtoCart(
        root: any,
        { productId }: { productId: string },
        context: KeystoneContext
): Promise<CartItemCreateInput> {
        console.log('Adding to cart!');
        // query the current user and see if they are signed in
        const sesh = context.session as Session;
        if(!sesh.itemId) {
            throw new Error('You must be logged in to do this!')
        }
        // query the current user cart
        const allCartItems = await context.lists.CartItem.findMany({
            where: { user: {id: sesh.itemId }, product: { id: productId } },
            resolveFields: 'id,quantity'
        });
        const [existingCartItem] = allCartItems;
        if(existingCartItem) {
            console.log(`There are already ${existingCartItem.quantity} in the cart, incremement by 1`);
              // see if the current item is in their cart
        // if it is increment by 1
            return await context.lists.CartItem.updateOne({
            id: existingCartItem.id,
            data:   { quantity: existingCartItem.quantity + 1 },
        });
    }
    return await context.lists.CartItem.createOne({
        data: {
            product: { connect: { id: productId }},
            user: { connect: {id: sesh.itemId }},
        }
    })
  
        // if it isnt create  new cart item
}

export default addtoCart;
