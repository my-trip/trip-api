<template>
    <div class="vue-tempalte">
        <div class="container">
            <div class="card" style="width: 18rem;">
                <form>
                    <h3>Login</h3>
                    <div class="form-group mt-10">
                        <label>Email</label>
                        <input type="email" class="form-control form-control-lg" />
                    </div>
                    <div class="form-group">
                        <label>Senha</label>
                        <input type="password" class="form-control form-control-lg" />
                    </div>
                    <button type="submit" class="btn btn-default btn-lg btn-block">Sign In</button>

                </form>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "LoginPage",
        data() {
            return {}
        }
    }
</script>