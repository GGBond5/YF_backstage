<template>
  <div class="managementDetails flex-column">
    <YfDetailsHeader :path="'/expendManagement/management'+this.info.hash" :title="info.title"></YfDetailsHeader>
    <div class="header flex-vCenter">
      <i class="yfFont icon-biaotiqian"></i>
      <span>项目详情</span>
    </div>
    <div class="container">
      <div class="detailsContent">
        <!-- 项目立项 -->
        <YfCollapse title="项目立项管理" :rules="rules" :isShow="['项目立项', '编辑'].includes(info.title) ? true : false" ref="collapse1">
          <div class="projectSetUp">
            <el-form :model="proSetUpForm" :rules="rules" ref="proSetUpForm" label-width="110px" label-position="left" label-suffix=":" class="demo-ruleForm">
              <p>
                <el-form-item label="所属场站" prop="proSetUpPlant">
                  <el-select v-model="proSetUpForm.proSetUpPlant" placeholder="请选择" :disabled="info.isEstablishOff" @change="budgetary()">
                    <el-option v-for="(item, index) in deptPlantList" :key="index" :label="item.plantName" :value="item.plantId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="标的名称" prop="proSetUpActivityName">
                  <el-input v-model="proSetUpForm.proSetUpActivityName" :disabled="info.isEstablishOff" maxlength="50"></el-input>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="项目类型" prop="proSetUpProjectType">
                  <el-select v-model="proSetUpForm.proSetUpProjectType" placeholder="请选择项目类型" :disabled="info.isEstablishOff">
                    <el-option v-for="(item, index) in ProjectType" :key="index" :label="item.projectTypeName" :value="item.projectType"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="预算科目" prop="proSetUpBudgetCode">
                  <el-select v-model="proSetUpForm.proSetUpBudgetCode" placeholder="请选择预算科目" :disabled="info.isEstablishOff" @change="budgetary()">
                    <el-option v-for="(item, index) in budgetCodeList" :key="index" :label="item.budgetCodeName" :value="item.budgetCode"></el-option>
                  </el-select>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="预算金额" prop="proSetUpMoney">
                  <el-input v-model.number="proSetUpForm.proSetUpMoney" :disabled="info.isEstablishOff" @input="budgetary()" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" maxlength="50">
                    <span slot="suffix" style="marginRight: 10px;">元</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="预算检查" required>
                  <el-tooltip class="item" effect="light" placement="top-start" :disabled="!proSetUpForm.proSetUpCheck" >
                    <div slot="content" class="tooltip">
                      <!-- <p>场站的可用投资预算（元）:</p> -->
                      <h4>{{proSetUpForm.plantResidue}}</h4>
                      <!-- <p>项目公司的可用投资预算（元）:</p> -->
                      <h4>{{proSetUpForm.totalResidue}}</h4>
                    </div>
                    <span :class="`color${proSetUpForm.proSetUpCheck?1:5}`">{{proSetUpForm.proSetUpCheck? '超预算': '未超预算'}}</span>
                  </el-tooltip>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="计划采购时间" prop="proSetUpTime">
                  <el-date-picker
                    v-model="proSetUpForm.proSetUpTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="info.isEstablishOff"
                    @change="budgetary()">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="采购方式" prop="proSetUpPurchasingMethod">
                  <el-select v-model="proSetUpForm.proSetUpPurchasingMethod" placeholder="请选择采购方式" :disabled="info.isEstablishOff">
                    <el-option v-for="(item, index) in purchasingMethod" :key="index" :label="item.purchasingMethodName" :value="item.purchasingMethod"></el-option>
                  </el-select>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="立项支撑文件" required :error="fileErrList.approvalErr">
                  <el-upload
                    class="upload-demo"
                    ref="upload1"
                    action="http://192.168.10.181:10002/file/uploadFileList"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '立项支撑文件')}" 
                    :file-list="approvalList"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isEstablishOff">
                    <el-button slot="trigger" v-for="(item, index) in approvalBtns" :key="index" @click="selectFile(item)" v-show="!info.isEstablishOff"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="approvalList && approvalList.length > 0">
                    <ul>
                      <li v-for="(item, index) in approvalList" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'approvalBtns')}`,`bgColor${findTagColor(item, 'approvalBtns')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isEstablishOff">
                          <i class="el-icon-close" @click="fileDel(item, approvalList, 'collapse1', 1)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span> 
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p v-if="purchaseTableData.length > 0">
                <el-form-item label="统一采购项目:">
                  <el-table
                    :data="purchaseTableData"
                    border
                    style="width: 100%">
                    <el-table-column
                      label="序号"
                      width="80">
                      <template slot-scope="scope">
                        <div :class="setBlue(scope.row)" @click="increasePurchase(scope.row)"><i class="el-icon-plus" v-if="scope.row.serialNumber === '添加统一采购项目'" style="marginRight: 5px"></i>{{scope.row.serialNumber}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="plantName"
                      label="场站"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="tenderName"
                      label="标的名称"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="projectTypeName"
                      label="项目类型">
                    </el-table-column>
                    <el-table-column
                      prop="budgetCodeName"
                      label="预算科目"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="budget"
                      label="预算金额（元）"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="planPurchasingTime"
                      label="计划采购时间"
                      width="180">
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </p>
            </el-form>
          </div>
          <div class="btns flex-center" v-if="!info.isEstablishOff">
            <el-button @click="cencel()" plain>取消</el-button>
            <el-button plain @click="temporaryStorage('项目立项')">保存草稿</el-button>
            <el-popconfirm
              confirm-button-text='确认'
              cancel-button-text='取消'
              icon="el-icon-info"
              icon-color="red"
              title="确认提交审核吗？"
              @confirm="submitForm('项目立项')"
            >
              <el-button type="primary" slot="reference">提交审核</el-button>
            </el-popconfirm>
          </div>
        </YfCollapse>
        <!-- 编制采购文件, 合同拟稿 -->
        <YfCollapse title="项目采购管理" v-if="['项目立项', '编辑'].includes(info.title) ? false : true" :isShow="['编制采购文件', '合同拟稿'].includes(info.title) ? true : false" ref="collapse2">
          <div class="purchase">
            <el-form ref="ruleForm" label-width="110px" label-position="left" label-suffix=":"  class="demo-ruleForm">
              <p class="uploading">
                <el-form-item label="采购文件" required :error="fileErrList.purchaseErr">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '采购文件')}" 
                    :file-list="purchaseList"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isPurchaseOff">
                    <el-button slot="trigger" v-for="(item, index) in purchaseListBtns" :key="index" @click="selectFile(item)" v-show="!info.isPurchaseOff"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="purchaseList && purchaseList.length > 0">
                    <ul>
                      <li v-for="(item, index) in purchaseList" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'purchaseListBtns')}`,`bgColor${findTagColor(item, 'purchaseListBtns')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isPurchaseOff">
                          <i slot="reference" class="el-icon-close" @click="fileDel(item, purchaseList, 'collapse2', 2)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span> 
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="SAP立项资料" required :error="fileErrList.SAPErr">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, 'SAP立项资料')}" 
                    :file-list="SAPList"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isPurchaseOff">
                    <el-button slot="trigger" v-for="(item, index) in SAPListBtns" :key="index"  @click="selectFile(item)" v-show="!info.isPurchaseOff"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="SAPList && SAPList.length > 0">
                    <ul>
                      <li v-for="(item, index) in SAPList" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'SAPListBtns')}`,`bgColor${findTagColor(item, 'SAPListBtns')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isPurchaseOff">
                          <i class="el-icon-close" @click="fileDel(item, SAPList, 'collapse2', 2)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
            </el-form>
          </div>
          <div class="draft" v-if="info.title === '编制采购文件' ? false : true">
            <el-form :model="draftForm" ref="draftForm" :rules="rules"  label-width="110px" label-position="left" label-suffix=":" class="demo-ruleForm">
              <p>
                <el-form-item label="合同总价" prop="contractAmount">
                  <el-input v-model="draftForm.contractAmount" :disabled="info.isDraftOff" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
                </el-form-item>
                <el-form-item label="税率" prop="rate">
                  <el-input v-model="draftForm.rate" :disabled="info.isDraftOff" oninput="value=value.replace(/^\D*(\d{1,2}(?:\.\d{0,2})?).*$/g,'$1')" placeholder="请输入税率（例10.01）">
                    <span slot="suffix" style="marginRight: 10px;">%</span> 
                  </el-input>
                </el-form-item>
                <el-form-item label="净价">
                  <span>￥</span>
                  <span v-format="'#,##0.####'">{{draftForm.netPrice?draftForm.netPrice:draftPrice}}</span>
                  <span>元</span>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="合同拟稿" required :error="fileErrList.draftErr">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '合同拟稿')}" 
                    :file-list="draftList"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isDraftOff">
                    <el-button slot="trigger"  v-for="(item, index) in contractListBtns" :key="index"  @click="selectFile(item)"  v-show="!info.isDraftOff"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="draftList && draftList.length > 0">
                    <ul>
                      <li v-for="(item, index) in draftList" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'contractListBtns')}`,`bgColor${findTagColor(item, 'contractListBtns')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isDraftOff">
                          <i class="el-icon-close" @click="fileDel(item, draftList, 'collapse2', 3)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
            </el-form>
          </div>
          <div class="btns flex-center" v-if="!info.isPurchaseOff || !info.isDraftOff">
            <el-button @click="cencel()" plain>取消</el-button>
            <el-button plain @click="temporaryStorage('编制采购文件和合同拟稿')">保存草稿</el-button>
            <el-popconfirm
              confirm-button-text='确认'
              cancel-button-text='取消'
              icon="el-icon-info"
              icon-color="red"
              title="确认提交审核吗？"
              @confirm="submitForm('编制采购文件和合同拟稿')"
            >
              <el-button type="primary" slot="reference">提交审核</el-button>
            </el-popconfirm>
          </div>
        </YfCollapse>
        <!-- 项目实施 -->
        <YfCollapse title="项目实施管理" v-if="['项目立项', '编辑', '编制采购文件', '合同拟稿'].includes(info.title) ? false : true" :isShow="info.title === '项目实施' ? true : false" ref="collapse3">
          <div class="implementation">
            <el-form ref="ruleForm"  label-width="110px" label-position="left" label-suffix=":"  class="demo-ruleForm">
              <p class="uploading">
                <el-form-item label="到货验收" :required="projectEdit.projectType === 1" :error="fileErrList.implementationErr1">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施1')}" 
                    :file-list="implementationList1"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isImplementation">
                    <el-button slot="trigger" v-for="(item, index) in implementationBtns1" :key="index" @click="selectFile(item)" v-show="!info.isImplementation"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList1 && implementationList1.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList1" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'implementationBtns1')}`,`bgColor${findTagColor(item, 'implementationBtns1')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isImplementation">
                          <i class="el-icon-close" @click="fileDel(item, implementationList1, 'collapse3', 4)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="实物照片" :required="projectEdit.projectType === 1" :error="fileErrList.implementationImageErr1">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施图片1')}" 
                    :file-list="implementationImageList1"
                    :auto-upload="false"
                    :disabled="info.isImplementation">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="三措两案" :required="projectEdit.projectType !== 1"  :error="fileErrList.implementationErr2">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施2')}" 
                    :file-list="implementationList2"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isImplementation">
                    <el-button slot="trigger" v-for="(item, index) in implementationBtns2" :key="index" @click="selectFile(item)" v-show="!info.isImplementation"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList2 && implementationList2.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList2" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'implementationBtns2')}`,`bgColor${findTagColor(item, 'implementationBtns2')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isImplementation">
                          <i class="el-icon-close" @click="fileDel(item, implementationList2, 'collapse3', 4)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="外包入场审查" :required="projectEdit.projectType !== 1" :error="fileErrList.implementationErr3">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施3')}" 
                    :file-list="implementationList3"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isImplementation">
                    <el-button slot="trigger" v-for="(item, index) in implementationBtns3" :key="index" @click="selectFile(item)" v-show="!info.isImplementation"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList3 && implementationList3.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList3" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'implementationBtns3')}`,`bgColor${findTagColor(item, 'implementationBtns3')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isImplementation">
                          <i class="el-icon-close" @click="fileDel(item, implementationList3, 'collapse3', 4)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="开工报告" :required="projectEdit.projectType !== 1" :error="fileErrList.implementationErr4">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施4')}" 
                    :file-list="implementationList4"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isImplementation">
                    <el-button slot="trigger" v-for="(item, index) in implementationBtns4" :key="index" @click="selectFile(item)" v-show="!info.isImplementation"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList4 && implementationList4.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList4" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'implementationBtns4')}`,`bgColor${findTagColor(item, 'implementationBtns4')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isImplementation">
                          <i class="el-icon-close" @click="fileDel(item, implementationList4, 'collapse3', 4)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="关联督办单" :required="projectEdit.projectType !== 1">
                  <div>
                    <el-button type="primary" round style="marginBottom: 10px;">发起督办单</el-button>
                  </div>
                  <div>
                    <el-table
                      :data="superviseTableData"
                      border
                      style="width: 100%;maxWidth: 1260px;">
                      <el-table-column
                        prop="name"
                        label="序号"
                        width="80">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="督办单编号"
                        width="120">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="督办单类型"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="督办单类别"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="场站名称"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="设备名称"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="address"
                        label="工作内容">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="计划开工时间/故障发生时间"
                        width="120">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="负责人"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="督办单状态"
                        width="120">
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                          <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="过程监督" :required="projectEdit.projectType !== 1"  :error="fileErrList.implementationErr5">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施5')}" 
                    :file-list="implementationList5"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isImplementation">
                    <el-button slot="trigger" v-for="(item, index) in implementationBtns5" :key="index" @click="selectFile(item)" v-show="!info.isImplementation"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList5 && implementationList5.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList5" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'implementationBtns5')}`,`bgColor${findTagColor(item, 'implementationBtns5')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isImplementation">
                          <i class="el-icon-close" @click="fileDel(item, implementationList5, 'collapse3', 4)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="验收" :required="projectEdit.projectType !== 1" :error="fileErrList.implementationErr6">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施6')}" 
                    :file-list="implementationList6"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isImplementation">
                    <el-button slot="trigger" v-for="(item, index) in implementationBtns6" :key="index" @click="selectFile(item)" v-show="!info.isImplementation"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList6 && implementationList6.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList6" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'implementationBtns6')}`,`bgColor${findTagColor(item, 'implementationBtns6')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isImplementation">
                          <i class="el-icon-close" @click="fileDel(item, implementationList6, 'collapse3', 4)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="实物照片" :required="projectEdit.projectType !== 1"  :error="fileErrList.implementationImageErr2">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview2"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施图片2')}" 
                    :file-list="implementationImageList2"
                    :auto-upload="false"
                    :disabled="info.isImplementation">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible2">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="完工总结" :required="projectEdit.projectType !== 1" :error="fileErrList.implementationErr7">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施7')}" 
                    :file-list="implementationList7"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isImplementation">
                    <el-button slot="trigger"  v-for="(item, index) in implementationBtns7" :key="index" @click="selectFile(item)" v-show="!info.isImplementation"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList7 && implementationList7.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList7" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'implementationBtns7')}`,`bgColor${findTagColor(item, 'implementationBtns7')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isImplementation">
                          <i class="el-icon-close" @click="fileDel(item, implementationList7, 'collapse3', 4)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
            </el-form>
          </div>
          <div class="btns flex-center" v-if="!info.isImplementation">
            <el-button @click="cencel()" plain>取消</el-button>
            <el-button plain @click="temporaryStorage('项目实施')">保存草稿</el-button>
            <el-popconfirm
              confirm-button-text='确认'
              cancel-button-text='取消'
              icon="el-icon-info"
              icon-color="red"
              title="确认提交审核吗？"
              @confirm="submitForm('项目实施')"
            >
              <el-button type="primary" slot="reference">提交审核</el-button>
            </el-popconfirm>
          </div>
        </YfCollapse>
        <!-- 入账计划 -->
        <YfCollapse title="投资预算管理" v-if="['项目立项', '编辑', '编制采购文件', '合同拟稿'].includes(info.title) ? false : true" :isShow="info.title === '入账计划' ? true : false" ref="collapse4">
          <div v-if="investment && investment.years && investment.years.at(-1).status === 3" slot="status" class="contractStatus">
            <i class="el-icon-warning"></i>
            <span>1条入账计划审核不通过</span>
          </div>
          <div class="income">
            <el-form :rules="rules" ref="ruleForm"  label-width="110px" label-position="left" class="demo-ruleForm">
              <p>
                <el-form-item label="合同总价：">
                  <el-input v-model="incomeForm.contractTotal" :disabled="info.isDraftOff"></el-input>
                </el-form-item>
                <el-form-item label="税率：">
                  <el-input v-model="incomeForm.rate" :disabled="info.isDraftOff"></el-input>
                </el-form-item>
                <el-form-item label="净价：">
                  <span>￥</span>
                  <span v-format="'#,##0.####'">{{incomeForm.netPrice}}</span>
                  <span>元</span>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="入账是否含税：">
                  <el-radio-group v-model="incomeForm.resource" :disabled="info.isInvestOff">
                    <el-radio :label="true">含税</el-radio>
                    <el-radio :label="false">不含税</el-radio>
                  </el-radio-group>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="年度入账计划：">
                  <el-table
                    :data="incomeTableData"
                    border
                    :span-method="arraySpanMethod"
                    show-summary
                    :summary-method="getSummaries"
                    style="width: 100%">
                    <el-table-column
                      label="序号"
                      width="60">
                      <template slot-scope="scope">
                        <div :class="setBlue(scope.row)" @click="increaseIncome(scope.row)">
                          <i class="el-icon-plus" v-if="scope.row.serialNumber === '新增年度入账计划'" style="marginRight: 5px"></i>{{scope.row.serialNumber}}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="year"
                      label="年度"
                      width="180">
                      <template slot-scope="scope">
                        <div>{{$moment(scope.row.year).format('yyyy年')}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="planAmount"
                      label="计划入账金额（元）"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="comment"
                      label="备注">
                    </el-table-column>
                    <el-table-column
                      prop="statusName"
                      label="计划审核状态"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="180">
                      <template slot-scope="scope">
                        <div v-if="!['审核通过', '审核中'].includes(scope.row.statusName)">
                          <el-button type="text" size="small" @click="yearPlanEdit('incomeTableData', scope.row)">
                            <span style="padding-right: 10px;margin-right: 10px;border-right: 1px solid #409EFF;">{{scope.row.operation && scope.row.operation[0]}}</span>
                          </el-button>
                          <el-popconfirm
                            title="确定删除吗？"
                            @confirm="del('incomeTableData', scope.row)"
                          >
                            <el-button slot="reference" type="text" size="small">{{scope.row.operation && scope.row.operation[1]}}</el-button>
                          </el-popconfirm>
                        </div>
                        <div v-else>-</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="入账明细列表：">
                  <el-table
                    :data="inDetailData"
                    border
                    show-summary
                    :summary-method="getSummaries"
                    style="width: 100%">
                    <el-table-column
                      prop="serialNumber"
                      label="序号"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="month"
                      label="月份"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="planAmount"
                      label="计划入账金额（元）"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="comment"
                      label="备注">
                    </el-table-column>
                    <el-table-column
                      prop="fileCount"
                      label="入账材料"
                      width="120">
                      <template slot-scope="scope">
                        <div class="uploadNumStyle" @mouseenter="MEnter($event, scope.row.materials, 'materialsShow', 'uploadList')" @mouseleave="MLeave('materialsShow')">{{scope.row.fileCount}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="statusName"
                      label="审核状态"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="actualAmount"
                      label="实际入账金额（元）"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="count"
                      label="入账次数"
                      width="120">
                      <template slot-scope="scope">
                        <div class="blueTextBtn underline" @click="inDetailsRecord(scope.row)">{{scope.row.count}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="operation"
                      label="操作"
                      width="120">
                      <template slot-scope="scope">
                        <div v-if="scope.row.statusName === '审核通过'" class="blueTextBtn" @click="inFunctionality(scope.row)">{{scope.row.operation}}</div>
                        <div v-else>--</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="累计入账金额：">
                  <span>￥</span>
                  <span>{{incomeForm.amountSum?incomeForm.amountSum:'-'}}</span>
                  <span>元</span>
                </el-form-item>
                <el-form-item label="累计入账比例：">
                  <span>{{incomeForm.amountSumRatio?incomeForm.amountSumRatio:'-'}}%</span>
                </el-form-item>
              </p>
            </el-form>
            <!-- 新增年度入账计划 -->
            <el-dialog
              title="年度入账计划"
              :visible.sync="increaseDialog"
              width="30%">
              <div class="increaseContent">
                <el-form ref="enterform" label-width="120px">
                  <el-form-item label="计划入账年度：">
                    <el-col :span="22">
                      <el-date-picker
                        v-model="enterform.year"
                        type="year"
                        placeholder="选择年"
                        style="width: 100%;"
                        format="yyyy年">
                      </el-date-picker>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="计划入账金额：">
                    <el-col :span="22">
                      <el-input v-model="enterform.money" @blur="checkBudget('enterform', 1)"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="备注：">
                    <el-col :span="22">
                      <el-input v-model="enterform.remark" maxlength="50"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="预算检查：">
                    <el-tooltip class="item" effect="light" placement="top-start" :disabled="!enterform.check" >
                      <div slot="content" class="tooltip">
                        <!-- <p>场站的可用投资预算（元）:</p> -->
                        <h4>{{enterform.plantResidue}}</h4>
                        <!-- <p>项目公司的可用投资预算（元）:</p> -->
                        <h4>{{enterform.totalResidue}}</h4>
                      </div>
                      <span :class="`color${enterform.check?1:5}`">{{enterform.check?'超预算':'未超预算'}}</span>
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="increaseDialog = false">取 消</el-button>
                <el-button type="primary" @click="increaseYear()">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 鼠标悬浮 -->
            <div class="hoverShow" ref="uploadList" v-show="materialsShow" @mouseenter="hoverEnter" @mouseleave="hoverLeave('materialsShow')">
              <h4>入账材料</h4>
              <div class="SContent">
                <ul>
                  <li v-for="(item, index) in bookedMaterial" :key="index">
                    <span>
                      <span :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                    </span>
                    <span>{{item.fileName}}</span>
                    <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                    <span class="yfFont icon-xiazai" @click="download(item)"></span>
                  </li>
                </ul>
                <el-empty :image-size="50"  description="暂无材料" v-if="bookedMaterial && bookedMaterial.length == 0"></el-empty>
              </div>
            </div>
            <!-- 入账明细 - 添加入账计划 -->
            <el-dialog
              title="添加入账计划"
              :visible.sync="increaseRecord"
              width="30%">
              <div class="increaseContent">
                <el-form ref="recoedform" label-width="120px">
                  <el-form-item label="实际入账月份：">
                    <el-col :span="22">
                      <el-date-picker
                        v-model="recoedform.month"
                        type="month"
                        placeholder="选择月份"
                        style="width: 100%;"
                        format="yyyy年MM月">
                      </el-date-picker>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="实际入账金额：">
                    <el-col :span="22">
                      <el-input v-model="recoedform.money"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="备注：">
                    <el-col :span="22">
                      <el-input v-model="recoedform.remark"  maxlength="50"></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="increaseRecord = false">取 消</el-button>
                <el-button type="primary" @click="addMonthRecord()">保 存</el-button>
              </span>
            </el-dialog>
            <!-- 入账详情记录 -->
            <el-dialog
              title="入账详情记录"
              :visible.sync="DeRecodeDialog"
              width="30%">
              <div class="detailsRecord">
                <el-timeline>
                  <el-timeline-item  v-for="(item, index) in BillOperation" :key="'Bill'+index">
                    <div class="TLHeader flex-between">
                      <span>第{{item.no}}次入账</span>
                      <span>操作时间：{{item.updateTime}}</span>
                    </div>
                    <el-card>
                      <p>实际入账月份：{{$moment(item.dataDate).format('yyyy年MM月')}}</p>
                      <p>实际入账金额：<span>{{item.amount}}</span>元</p>
                      <p>备注：{{item.comment}}</p>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="DeRecodeDialog = false">取 消</el-button>
                <el-button type="primary" @click="DeRecodeDialog = false">关闭</el-button>
              </span>
            </el-dialog>
          </div>
          <div class="btns flex-center" v-if="!this.info.billReadonly">
            <el-button @click="cencel()" plain>取消</el-button>
            <el-button plain @click="temporaryStorage('入账计划')">保存草稿</el-button>
            <el-popconfirm
              confirm-button-text='确认'
              cancel-button-text='取消'
              icon="el-icon-info"
              icon-color="red"
              title="确认提交审核吗？"
              @confirm="submitForm('入账计划')"
            >
              <el-button type="primary" slot="reference">提交审核</el-button>
            </el-popconfirm>
          </div>
        </YfCollapse>
        <!-- 付款计划 -->
        <YfCollapse title="资金预算管理" v-if="['项目立项', '编辑', '编制采购文件', '合同拟稿'].includes(info.title) ? false : true" :isShow="info.title === '付款计划' ? true : false" ref="collapse5">
          <div v-if="funds && funds.years && funds.years.at(-1).status === 3" slot="status" class="contractStatus">
            <i class="el-icon-warning"></i>
            <span>1条入账计划审核不通过</span>
          </div>
          <div class="outcome">
            <el-form :model="outcomeForm" :rules="rules" ref="ruleForm"  label-width="110px" label-position="left" class="demo-ruleForm">
              <p>
                <el-form-item label="质保金：">
                  <el-input v-model="outcomeForm.retentionMoney" :disabled="info.isCapitalOff"></el-input>
                </el-form-item>
                <el-form-item label="质保期：">
                  <el-input v-model="outcomeForm.warranty" :disabled="info.isCapitalOff"  maxlength="50"></el-input>
                </el-form-item>
                <el-form-item>
                  <!-- 占位 -->
                </el-form-item>
              </p>
              <p>
                <el-form-item label="出质保日期：">
                  <el-date-picker type="date" placeholder="选择日期" v-model="outcomeForm.warrantyDate" style="width: 100%;" :disabled="info.isCapitalOff"></el-date-picker>
                </el-form-item>
                <el-form-item>
                </el-form-item>
                <el-form-item>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="年度付款计划：">
                  <el-table
                    :data="paymentData"
                    border
                    :span-method="arraySpanMethod"
                    show-summary
                    :summary-method="getSummaries"
                    style="width: 100%">
                    <el-table-column
                      prop="serialNumber"
                      label="序号"
                      width="80">
                      <template slot-scope="scope">
                        <div :class="setBlue(scope.row)" @click="increasePayment(scope.row)"><i class="el-icon-plus" v-if="scope.row.serialNumber === '新增年度付款计划'" style="marginRight: 5px"></i>{{scope.row.serialNumber}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="year"
                      label="年度"
                      width="180">
                      <template slot-scope="scope">
                        <div>{{$moment(scope.row.year).format('yyyy年')}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="planAmount"
                      label="计划入账金额（元）"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="comment"
                      label="备注">
                    </el-table-column>
                    <el-table-column
                      prop="statusName"
                      label="计划审核状态"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="180">
                      <template slot-scope="scope">
                        <div v-if="!['审核通过', '审核中'].includes(scope.row.statusName)">
                          <el-button type="text" size="small" @click="yearPlanEdit('paymentData', scope.row)">
                            <span style="padding-right: 10px;margin-right: 10px;border-right: 1px solid #409EFF;">{{scope.row.operation && scope.row.operation[0]}}</span>
                          </el-button>
                          <el-popconfirm
                            title="确定删除吗？"
                            @confirm="del('paymentData', scope.row)"
                          >
                            <el-button slot="reference" type="text" size="small">{{scope.row.operation && scope.row.operation[1]}}</el-button>
                          </el-popconfirm>
                        </div>
                        <div v-else>-</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item> 
              </p>
              <p>
                <el-form-item label="付款明细列表：">
                  <el-table
                    :data="outDetailData"
                    border
                    show-summary
                    :summary-method="getSummaries"
                    style="width: 100%">
                    <el-table-column
                      prop="serialNumber"
                      label="序号"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="month"
                      label="月份"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="planAmount"
                      label="计划入账金额（元）"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="comment"
                      label="备注">
                    </el-table-column>
                    <el-table-column
                      prop="fileCount"
                      label="入账材料"
                      width="120">
                      <template slot-scope="scope"> 
                        <div class="uploadNumStyle" @mouseenter="MEnter($event, scope.row.materials, 'materialsShow2', 'uploadList2')" @mouseleave="MLeave('materialsShow2')">{{scope.row.fileCount}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="statusName"
                      label="审核状态"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="actualAmount"
                      label="实际入账金额（元）"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="count"
                      label="入账次数"
                      width="120">
                      <template slot-scope="scope">
                        <div class="blueTextBtn underline" @click="outDetailsRecord(scope.row)">{{scope.row.count}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="operation"
                      label="操作"
                      width="120">
                      <template slot-scope="scope">
                        <div v-if="scope.row.statusName === '审核通过'" class="blueTextBtn" @click="inFunctionality(scope.row)">{{scope.row.operation}}</div>
                        <div v-else>--</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="累计付款金额：">
                  <span>￥</span>
                  <span>{{outcomeForm.amountSum?outcomeForm.amountSum:'-'}}</span>
                  <span>元</span>
                </el-form-item>
                <el-form-item label="累计付款比例：">
                  <span>{{outcomeForm.amountSumRatio?outcomeForm.amountSumRatio:'-'}}%</span>
                </el-form-item>
              </p>
            </el-form>
            <!-- 新增年度付款计划弹窗 -->
            <el-dialog
              title="年度付款计划"
              :visible.sync="paymentDialog"
              width="30%">
              <div class="increaseContent">
                <el-form ref="comeform" label-width="120px">
                  <el-form-item label="计划付款年度：">
                    <el-col :span="22">
                      <el-date-picker
                        v-model="comeform.year"
                        type="year"
                        placeholder="选择年"
                        style="width: 100%;"
                        format="yyyy年">
                      </el-date-picker>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="计划付款金额：">
                    <el-col :span="22">
                      <el-input v-model="comeform.money" @blur="checkBudget('comeform', 2)"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="备注：">
                    <el-col :span="22">
                      <el-input v-model="comeform.remark"  maxlength="50"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="预算检查：">
                    <el-tooltip class="item" effect="light" placement="top-start" :disabled="!comeform.check" >
                      <div slot="content" class="tooltip">
                        <!-- <p>场站的可用投资预算（元）:</p> -->
                        <h4>{{comeform.plantResidue}}</h4>
                        <!-- <p>项目公司的可用投资预算（元）:</p> -->
                        <h4>{{comeform.totalResidue}}</h4>
                      </div>
                      <span :class="`color${comeform.check?1:5}`">{{comeform.check?'超预算':'未超预算'}}</span>
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="paymentDialog = false">取 消</el-button>
                <el-button type="primary" @click="paymentYear()">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 鼠标悬浮 -->
            <div class="hoverShow" ref="uploadList2" v-show="materialsShow2" @mouseenter="hoverEnter" @mouseleave="hoverLeave('materialsShow2')">
              <h4>入账材料</h4>
              <div class="SContent">
                <ul>
                  <li v-for="(item, index) in bookedMaterial" :key="index">
                    <span>
                      <span :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                    </span>
                    <span>{{item.fileName}}</span>
                    <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                    <span class="yfFont icon-xiazai" @click="download(item)"></span>
                  </li>
                </ul>
                <el-empty :image-size="50"  description="暂无材料" v-if="bookedMaterial && bookedMaterial.length == 0"></el-empty>
              </div>
            </div>
            <!-- 付款明细 - 添加付款计划 -->
            <el-dialog
              title="添加付款计划"
              :visible.sync="payRecord"
              width="30%">
              <div class="increaseContent">
                <el-form ref="payRecoedform" label-width="120px">
                  <el-form-item label="实际付款月份：">
                    <el-col :span="22">
                      <el-date-picker
                        v-model="payRecoedform.month"
                        type="month"
                        placeholder="选择月份"
                        style="width: 100%;"
                        format="yyyy年MM月">
                      </el-date-picker>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="实际入账金额：">
                    <el-col :span="22">
                      <el-input v-model="payRecoedform.money"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="备注：">
                    <el-col :span="22">
                      <el-input v-model="payRecoedform.remark" maxlength="50"></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="payRecord = false">取 消</el-button>
                <el-button type="primary" @click="addMonthRecord2()">保 存</el-button>
              </span>
            </el-dialog>
            <!-- 付款详情记录 -->
            <el-dialog
              title="入账详情记录"
              :visible.sync="payRecodeDialog"
              width="30%">
              <div class="detailsRecord">
                <el-timeline>
                  <el-timeline-item  v-for="(item, index) in payOperation" :key="'pay'+index">
                    <div class="TLHeader flex-between">
                      <span>第{{item.id}}次入账</span>
                      <span>操作时间：{{item.updateTime}}</span>
                    </div>
                    <el-card>
                      <p>实际入账月份：{{$moment(item.dataDate).format('yyyy年MM月')}}</p>
                      <p>实际入账金额：<span>{{item.amount}}</span>元</p>
                      <p>备注：{{item.comment}}</p>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="payRecodeDialog = false">取 消</el-button>
                <el-button type="primary" @click="payRecodeDialog = false">关闭</el-button>
              </span>
            </el-dialog>
          </div>
          <div class="btns flex-center" v-if="!this.info.payReadonly">
            <el-button @click="cencel()" plain>取消</el-button>
            <el-button plain @click="temporaryStorage('付款计划')">保存草稿</el-button>
            <el-popconfirm
              confirm-button-text='确认'
              cancel-button-text='取消'
              icon="el-icon-info"
              icon-color="red"
              title="确认提交审核吗？"
              @confirm="submitForm('付款计划')"
            >
              <el-button type="primary" slot="reference">提交审核</el-button>
            </el-popconfirm>
          </div>
        </YfCollapse>
        <!-- 完工总结 -->
        <YfCollapse title="完工总结" v-if="['项目立项', '编辑', '编制采购文件', '合同拟稿', '项目实施', '入账计划', '付款计划'].includes(info.title) ? false : true" :isShow="info.title === '完工总结' ? true : false" ref="collapse6">
          <div class="comment">
            <el-form  label-width="110px" label-position="left" >
              <p>
                <el-form-item label="评价报告：">
                  <el-input
                    type="textarea"
                    :rows="2"
                    resize='none'
                    placeholder="请输入内容"
                     maxlength="200"
                    v-model="endForm.evaluate"
                    :disabled="info.isSummarize"> 
                  </el-input>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item>
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目评价报告')}" 
                    :file-list="commentList"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isSummarize">
                    <el-button slot="trigger" v-for="(item, index) in commentBtns" :key="index" @click="selectFile(item)"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="commentList && commentList.length > 0">
                    <ul>
                      <li v-for="(item, index) in commentList" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'commentBtns')}`,`bgColor${findTagColor(item, 'commentBtns')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.isSummarize">
                          <i class="el-icon-close" @click="fileDel(item, commentList, 'collapse6', 5)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
            </el-form>
          </div>
          <div class="btns flex-center" v-if="!info.isSummarize">
            <el-button @click="cencel()" plain>取消</el-button>
            <el-button plain @click="temporaryStorage('完工总结')">保存草稿</el-button>
            <el-popconfirm
              confirm-button-text='确认'
              cancel-button-text='取消'
              icon="el-icon-info"
              icon-color="red"
              title="确认提交审核吗？"
              @confirm="submitForm('完工总结')"
            >
              <el-button type="primary" slot="reference">提交审核</el-button>
            </el-popconfirm>
          </div>
        </YfCollapse>
        <!-- 供应商评价 -->
        <YfCollapse title="供应商评价" v-if="['项目立项', '编辑', '编制采购文件', '合同拟稿', '项目实施', '入账计划', '付款计划', '完工总结'].includes(info.title) ? false : true" :isShow="info.title === '供应商评价' ? true : false" ref="collapse7">
          <div class="comment">
            <el-form :model="supplierForm"  label-width="110px" label-position="left" >
              <p>
                <el-form-item label="对供应商评价：" class="rate">
                  <div>
                    <h5>{{supplierForm.contractSigningOrg}}</h5>
                  </div>
                  <div>
                    <span>企业资质条件：</span>
                    <span>
                      <el-input-number v-model="supplierForm.num1" :min="1" :max="5" label="描述文字" size="small" :disabled="info.isEvaluate"></el-input-number>
                    </span>
                  </div>
                  <div>
                    <span>质量保证能力：</span>
                    <span>
                      <el-input-number v-model="supplierForm.num2" :min="1" :max="5" label="描述文字" size="small" :disabled="info.isEvaluate"></el-input-number>
                    </span>
                  </div>
                  <div>
                    <span>配合度：</span>
                    <span>
                      <el-input-number v-model="supplierForm.num3" :min="1" :max="5" label="描述文字" size="small" :disabled="info.isEvaluate"></el-input-number>
                    </span>
                  </div>
                  <div>
                    <span>交付及时性：</span>
                    <span>
                      <el-input-number v-model="supplierForm.num4" :min="1" :max="5" label="描述文字" size="small" :disabled="info.isEvaluate"></el-input-number>
                    </span>
                  </div>
                  <div>
                    <el-input
                      type="textarea"
                      :rows="2"
                      resize='none'
                      placeholder="请输入内容"
                      maxlength="200"
                      v-model="supplierForm.supplier"
                      :disabled="info.isEvaluate">
                    </el-input>
                  </div>
                </el-form-item>
              </p>
            </el-form>
          </div>
          <div class="btns flex-center" v-if="!info.isEvaluate">
            <el-button @click="cencel()" plain>取消</el-button>
            <el-button plain @click="temporaryStorage('供应商评价')">保存草稿</el-button>
            <el-popconfirm
              confirm-button-text='确认'
              cancel-button-text='取消'
              icon="el-icon-info"
              icon-color="red"
              title="确认提交审核吗？"
              @confirm="submitForm('供应商评价')"
            >
              <el-button type="primary" slot="reference">提交审核</el-button>
            </el-popconfirm>
          </div>
        </YfCollapse>
      </div>
    </div>
    <!-- 流转过程 -->
    <div class="process" v-if="projectInfo">
      <YfCollapse title="流转过程" ref="collapse8" :isShow="false">
        <div class="statusWrap flex-center" slot="status">
          <span class="name">当前状态：</span>
          <span :class="[`color${getStatusId(projectEdit.projectStatus)}`,`bgColor${getStatusId(projectEdit.projectStatus)}`,`brColor${getStatusId(projectEdit.projectStatus)}`]">{{getStatusName(projectEdit.projectStatus)}}</span>
        </div>
        <timelineForm :activities="activities"></timelineForm>
      </YfCollapse>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import timelineForm from '@/views/expendManagement/timelineForm.vue'
export default {
  data() {
    return {
      delList: {},
      materialsShow: false,
      materialsShow2: false,
      bookedMaterial: [],
      timerLeave: null,
      activities: [],
      // baseFormData: {},
      info: {}, //用于接收
      tag: '', //上传文件的类型打上标签
      code: '',
      approvalList: [],
      purchaseList: [],   //采购页面的上传列表
      SAPList: [],        //采购页面的上传列表
      draftList: [],      //合同拟稿页面的上传列表
      summaryList: [],    //完善合同页面的上传列表
      summaryList1: [],
      summaryList2: [],
      summaryList3: [],
      implementationList1: [],  //项目实施页面的上传列表
      implementationList2: [],
      implementationList3: [],
      implementationList4: [],
      implementationList5: [],
      implementationList6: [],
      implementationList7: [],
      implementationImageList1: [], //项目实施页面的图片上传列表
      implementationImageList2: [],
      dialogImageUrl: '',     
      dialogVisible: false,   //项目实施页面的图片展示弹窗
      dialogVisible2: false,
      commentList: [],//完工总结页面的上传列表
      fileTypeList: [],
      approvalBtns: [],  //项目立项上传按钮
      purchaseListBtns: [],  //编制采购文件上传按钮
      SAPListBtns: [],
      contractListBtns: [],
      implementationBtns1: [], //项目立项上传按钮
      implementationBtns2: [],
      implementationBtns3: [],
      implementationBtns4: [],
      implementationBtns5: [],
      implementationBtns6: [],
      implementationBtns7: [],
      commentBtns: [],   //完工总结上传按钮
      proSetUpForm: { //项目立项表单
        proSetUpPlant: 1,
        proSetUpActivityName: '',
        proSetUpProjectType: '',
        proSetUpBudgetCode: '',
        proSetUpMoney: '',
        proSetUpCheck: false,
        proSetUpTime: this.$moment().format('yyyy-MM-DD HH:mm:ss'),
        proSetUpPurchasingMethod: '',
        plantResidue: '',
        totalResidue: '',
      },
      purchaseTableData: [],
      deptPlantList: [],
      ProjectType: [],
      budgetCodeList: [],
      purchasingMethod: [],
      projectEdit: {},
      projectInfo: {},
      investment: {},
      funds: {},
      files: {},
      draftForm: {
        contractAmount: '',
        rate: '', 
        netPrice: ''
      }, //合同拟稿表单
      incomeForm: { //入账计划表单
        contractTotal: '',
        rate: '',
        resource: true,
        amountSum: '',
        amountSumRatio: ''
      },
      outcomeForm: {  //付款计划表单
        retentionMoney: '',
        warranty: '',
        warrantyDate: '',
        amountSum: '',
        amountSumRatio: ''
      },
      increaseDialog: false,  //新增入账计划弹窗
      increaseRecord: false,
      payRecord: false,
      DeRecodeDialog: false,
      payRecodeDialog: false,
      paymentDialog: false,   //新增付款计划弹窗
      purchaseDialog: false,  //添加统一采购项目弹窗
      enterform: { //新增入账计划弹窗表单
        year: '',
        money: '',
        remark: '',
        check: false
      },
      recoedform: { //新增入账计划弹窗表单
        month: '',
        money: '',
        remark: '',
      },
      payRecoedform: { //新增入账计划弹窗表单
        month: '',
        money: '',
        remark: '',
      },
      BillOperation: [],
      payOperation: [],
      comeform: { //新增付款计划弹窗表单
        year: '',
        money: '',
        remark: '',
        check: false
      },
      endForm: {
        evaluate: ''
      },  //完工总结表单
      supplierForm: {
        contractSigningOrg: '',
        supplier: '',
        num1: 5,
        num2: 5,
        num3: 5,
        num4: 5,
      },
      rules: {  //表单校验
        proSetUpPlant: [
          { required: true, message: '请选择一种所属场站', trigger: 'change' }
        ],
        proSetUpActivityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { max: 50, message: '最多输入 50 个字符', trigger: 'change' }
        ],
        proSetUpProjectType: [
          { required: true, message: '请选择一种项目类型', trigger: 'change' }
        ],
        proSetUpBudgetCode: [
          { required: true, message: '请选择一种预算科目', trigger: 'change' }
        ],
        proSetUpMoney: [
          { required: true, message: '请输入预算金额', trigger: 'change' }
        ],
        proSetUpTime: [
          { required: true, message: '请输入计划采购时间', trigger: 'change' }
        ],
        proSetUpPurchasingMethod: [
          { required: true, message: '请选择一种采购方式', trigger: 'change' }
        ],
        // 合同拟稿
        contractAmount: [
          { required: true, message: '请输入合同总价', trigger: 'blur' },
          { max: 20, message: '最多输入 20 个字符', trigger: 'change' }
        ],
        rate: [
          { required: true, message: '请输入税率', trigger: 'blur' },
          { max: 20, message: '最多输入 20 个字符', trigger: 'change' }
        ]
      },
      fileErrList: {
        approvalErr: '',
        purchaseErr: '',
        SAPErr: '',
        draftErr: '',
        implementationErr1: '',
        implementationImageErr1: '',
        implementationErr2: '',
        implementationErr3: '',
        implementationErr4: '',
        implementationErr5: '',
        implementationErr6: '',
        implementationImageErr2: '',
        implementationErr7: '',
      },
      tagMapColor: [], //tag颜色映射表
      superviseTableData: [{  //项目实施中督办单表格
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      planAmountSum: 0,
      incomeTableData: [],//入账计划表格
      inDetailData:[], //入账明细表格
      infoRecord: {},
      paymentData: [], //付款计划
      outDetailData:[],//付款明细表格
      yearDelList: {}
    }
  },
  computed: {
    findTagColor () {
      return function (val, btns) {
        const item = this[btns].find(row => row.value === val.tag)
        return item.id%10 < 7 ? item.id%10 + 1 : 1
      }
    }, 
    draftPrice () {
      return this.draftForm.contractAmount && this.draftForm.rate ? Math.round(this.draftForm.contractAmount / ((100 + parseFloat(this.draftForm.rate))/100)) : '-'
    },
    getStatusName () {
      return function (params) {
        if (params === 1) {
          return '待审核'
        }else if (params === 2) {
          return '审核中'
        }else if (params === 3) {
          return '审核不通过'
        }else {
          return '审核通过'
        }
      }
    },
    getStatusId () {
      return function (params) {
        if (params === 1) {
          return 3
        }else if (params === 2) {
          return 4
        }else if (params === 3) {
          return 1
        }else {
          return 5
        }
      }
    },
    ...mapGetters(['storage'])
  },
  created () {
    this.init()
  },
  mounted() {
    //先预算检查一次
    this.budgetary() 
  },
  methods: {
    async init () {
      this.info = this.storage.management_details
      this.projectInfo = this.storage.managementEdit_details
      this.projectEdit = this.storage.managementEdit_details?.project
      this.investment = this.storage.managementEdit_details?.investment
      this.funds = this.storage.managementEdit_details?.funds
      this.files = this.storage.managementEdit_details?.files
      // 项目立项 规则
      this.deptPlantList = this.info.deptPlantList
      this.ProjectType = this.info.ProjectType
      this.budgetCodeList = this.info.budgetCodeList
      this.purchasingMethod = this.info.purchasingMethod
      // 上传按钮
      this.approvalBtns = this.info.fileTypeList[0].children 
      this.purchaseListBtns = this.info.fileTypeList[1].children.slice(0, -1) 
      this.SAPListBtns = this.info.fileTypeList[1].children.slice(-1)
      this.contractListBtns = [this.info.fileTypeList[2].children[0]]
      this.implementationBtns1 = this.info.fileTypeList[3].children.slice(0, 2)
      this.implementationBtns2 = [this.info.fileTypeList[3].children[3]]
      this.implementationBtns3 = [this.info.fileTypeList[3].children[4]]
      this.implementationBtns4 = [this.info.fileTypeList[3].children[5]]
      this.implementationBtns5 = this.info.fileTypeList[3].children.slice(6, 8)
      this.implementationBtns6 = this.info.fileTypeList[3].children.slice(8, 10)
      this.implementationBtns7 = this.info.fileTypeList[3].children.slice(-1)
      this.commentBtns = this.info.fileTypeList[4].children
      // 立项支撑文件     文件列表信息渲染
      if (this.files?.[1]) {
        this.approvalList = this.files[1] 
        this.approvalList.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
      }
      // 编制采购文件
      if (this.files?.[2]) {
        this.purchaseList = this.files[2].filter(val => {
          return val.fileCode !== 205
        })
        this.purchaseList.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
        this.SAPList = this.files[2].filter(val => {
          return val.fileCode === 205
        })
        this.SAPList.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
      }
      // 合同拟稿     文件列表信息渲染
      if (this.files?.[3]) {
        this.draftList = this.files[3].filter(val => {
          return val.fileCode === 300
        })
        this.draftList.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
      }
      // 项目实施     文件列表信息渲染
      let image1, image2
      if (this.files?.[4]) {
        this.implementationList1 = this.files[4].filter(val => {
          return val.fileCode === 400 || val.fileCode === 401
        })
        this.implementationList2 = this.files[4].filter(val => {
          return val.fileCode === 403
        })
        this.implementationList3 = this.files[4].filter(val => {
          return val.fileCode === 404
        })
        this.implementationList4 = this.files[4].filter(val => {
          return val.fileCode === 405
        })
        this.implementationList5 = this.files[4].filter(val => {
          return val.fileCode === 406 || val.fileCode === 407
        })
        this.implementationList6 = this.files[4].filter(val => {
          return val.fileCode === 408 || val.fileCode === 409
        })
        this.implementationList7 = this.files[4].filter(val => {
          return val.fileCode === 411
        })
        image1 = this.files[4].filter(val => {
          return val.fileCode === 402
        })
        image2 = this.files[4].filter(val => {
          return val.fileCode === 410
        })
        this.implementationList1.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
        this.implementationList2.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
        this.implementationList3.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
        this.implementationList4.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
        this.implementationList5.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
        this.implementationList6.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
        this.implementationList7.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
      }
      if (this.files?.[5]) {
        this.commentList = this.files[5] 
        this.commentList.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
      }
      if (this.projectEdit) { //项目立项需要显示的信息
        this.proSetUpForm.projectId = this.projectEdit.projectId
        this.proSetUpForm.proSetUpPlant = this.projectEdit.plantId
        this.proSetUpForm.proSetUpActivityName = this.projectEdit.tenderName
        this.proSetUpForm.proSetUpProjectType = this.projectEdit.projectType
        this.proSetUpForm.proSetUpBudgetCode = this.projectEdit.budgetCode
        this.proSetUpForm.proSetUpMoney = this.projectEdit.budget
        this.proSetUpForm.proSetUpCheck = this.projectEdit.budgetCheck
        this.proSetUpForm.proSetUpTime = this.projectEdit.planPurchasingTime
        this.proSetUpForm.proSetUpPurchasingMethod = this.projectEdit.purchasingMethod
      }
      // 项目立项后的 流转过程
      if (this.info.title !== '项目立项') {
        this.activities = this.projectInfo.logs
        this.activities.map((val, index) => {
          val.no = index + 1
        })
        // 统一采购数据
        this.purchaseTableData = this.storage.managementEdit_details.purchaseList
        this.purchaseTableData.map((val, index) => {
          val.serialNumber = index + 1
        })
        // 合同拟稿需要显示的信息
        if (['合同拟稿', '项目实施', '入账计划', '付款计划', '完工总结', '供应商评价'].includes(this.info.title)) {
          this.draftForm = this.projectInfo.purchase
        }
        // 项目实施需要显示的信息
        if (['项目实施', '入账计划', '付款计划', '完工总结', '供应商评价'].includes(this.info.title)) {
          if (image1?.length > 0) {
            for (const k in image1) {
              await this.$http.download(`/file/downloadFile?id=${image1[k].id}`).then(res => {
                image1[k].url = window.URL.createObjectURL(res.data); 
                image1[k].name = image1[k].fileName
              })
              this.implementationImageList1.push(image1[k])
            } 
          }
          if (image2?.length > 0) {
            for (const k in image2) {
              await this.$http.download(`/file/downloadFile?id=${image2[k].id}`).then(res => {
                image2[k].url = window.URL.createObjectURL(res.data); 
                image2[k].name = image2[k].fileName
              })
              this.implementationImageList2.push(image2[k])
            } 
          }
          if (this.info.title === '项目实施') {
          // 刷新页面
          this.$nextTick(() => {
            this.$refs.collapse3.settingDefaultShow()
          })
          }
        }
        // 入账计划需要显示的信息
        if (['入账计划', '付款计划', '完工总结', '供应商评价'].includes(this.info.title)) {
          this.incomeForm.contractTotal = this.investment?.contractTotal
          this.incomeForm.rate = this.investment?.rate
          this.incomeForm.netPrice = this.investment?.netPrice
          this.incomeForm.amountSum = this.investment?.amountSum
          this.incomeForm.amountSumRatio = this.investment?.amountSumRatio
          // 年度入账
          this.incomeTableData = [{serialNumber: '新增年度入账计划'}]
          this.investment?.years && this.incomeTableData.push(...this.investment.years)
          this.incomeTableData.map((val, index) => {
            if (index > 0) {
              val.serialNumber = index
              val.year = val.dataDate
              if (['待审核', '审核不通过'].includes(val.statusName)) {
                val.operation = ['编辑', '删除']
              }
            }
          })
          // 入账明细 
          this.inDetailData = []
          this.investment?.months && this.inDetailData.push(...this.investment.months)
          this.inDetailData.map((val, index) => {
            val.serialNumber = index + 1
            val.month = this.$moment(val.dataDate).format('yyyy年MM月')
            val.operation = parseInt(val.planAmount) > parseInt(val.actualAmount?val.actualAmount:'0')? '添加入账记录': '查看'
            val.materials = []
            this.projectInfo.files?.[7] && this.projectInfo.files[7].map(row => {
              if (row.dataDate === val.dataDate) {
                val.materials.push(row)
              }
            })
          })
          //刷新页面
          if (this.info.title === '入账计划') {
            this.$nextTick(() => {
              this.$refs.collapse4.settingDefaultShow()
            })
          }
        }
        // 付款计划需要显示的信息
        if (['付款计划', '完工总结', '供应商评价'].includes(this.info.title)) {
          this.$http.fetchGet(`/project/getInfo?projectId=${this.projectEdit.projectId}`).then(() => { 
            this.outcomeForm.retentionMoney = this.funds?.qualityGuaranteeMoney
            this.outcomeForm.warranty = this.funds?.qualityGuarantee
            this.outcomeForm.warrantyDate = this.funds?.qualityGuaranteeOutDate
            this.outcomeForm.amountSum = this.funds?.amountSum
            this.outcomeForm.amountSumRatio = this.funds?.amountSumRatio
            // 年度付款
            this.paymentData = [{serialNumber: '新增年度付款计划'}]
            this.funds?.years && this.paymentData.push(...this.funds.years)
            this.paymentData.map((val, index) => {
              if (index > 0) {
                val.serialNumber = index
                val.year = val.dataDate
                if (['待审核', '审核不通过'].includes(val.statusName)) {
                  val.operation = ['编辑', '删除']
                }
              }
            })
            // 付款明细 
            this.outDetailData = []
            this.funds?.months && this.outDetailData.push(...this.funds.months)
            this.outDetailData.map((val, index) => {
              val.serialNumber = index + 1
              val.month = this.$moment(val.dataDate).format('yyyy年MM月')
              val.operation = parseInt(val.planAmount) > parseInt(val.actualAmount?val.actualAmount:'0')? '添加付款记录': '查看'
              val.materials = []
              this.projectInfo.files?.[8] && this.projectInfo.files[8].map(row => {
                if (row.dataDate === val.dataDate) {
                  val.materials.push(row)
                }
              })
            })
            // 刷新页面
            if (this.info.title === '付款计划') {
              this.$nextTick(() => {
                this.$refs.collapse5.settingDefaultShow()
              })
            }
          })
        }
        // 完工总结需要显示的信息
        if (['完工总结', '供应商评价'].includes(this.info.title)) {
          if (this.projectInfo.projectDone) {
            this.endForm = this.projectInfo.projectDone
          }
        }
        if (['供应商评价'].includes(this.info.title)) {
          if (this.projectInfo.projectEvaluate) {
            this.supplierForm.num1 = this.projectInfo.projectEvaluate.qualification
            this.supplierForm.num2 = this.projectInfo.projectEvaluate.qualityAssurance
            this.supplierForm.num3 = this.projectInfo.projectEvaluate.cooperate
            this.supplierForm.num4 = this.projectInfo.projectEvaluate.deliverTimeliness
            this.supplierForm.supplier = this.projectInfo.projectEvaluate.evaluate
          }
          if (this.projectInfo.purchase.contractSigningOrg) {
            this.supplierForm.contractSigningOrg = this.projectInfo.purchase.contractSigningOrg
            this.$nextTick(() => {
              this.$refs.collapse7.settingDefaultShow()
            })
          }
        }
      }
    },
    submitForm(title) {
      debugger;
      let loser = false
      const formDatas = new FormData();
      const uploadFile = this.$http.upload(`/file/uploadFileList?date=${this.$moment().format('yyyy-MM-DD')}&type=3`, formDatas)
      // 项目立项
      if (title === '项目立项') {
        // 表单校验
        this.fileErrList.approvalErr = this.approvalList.length > 0?'':'请选择1个或以上立项支撑文件'
        this.$refs.proSetUpForm.validate((valid) => {
          if (valid && this.approvalList.length > 0) {
            // alert('submit!');
          } else {
            console.log('error submit!!');
            loser = true
            return false;
          }
        });
        if (loser) return
        let list = []
        this.approvalList.forEach((val)=>{
          if(val.raw){
            formDatas.append("file", val.raw);
            list.push({
              fileCode: val.code,
              fileName: val.name,
              fileSize: val.size,
            })
          }      
        });
        Promise.all([uploadFile, this.$http.fetch(`/project/projectEdit`, {
          "budget": this.proSetUpForm.proSetUpMoney,
          "budgetCheck": this.proSetUpForm.proSetUpCheck,
          "budgetCode": this.proSetUpForm.proSetUpBudgetCode,
          "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
          "isAudit": true,
          "planPurchasingTime": this.proSetUpForm.proSetUpTime,
          "plantId": this.proSetUpForm.proSetUpPlant,
          "projectId": this.proSetUpForm?.projectId, 
          "projectType": this.proSetUpForm.proSetUpProjectType,
          "purchasingMethod": this.proSetUpForm.proSetUpPurchasingMethod,
          "status": this.projectEdit?.projectStatus,
          "tenderName": this.proSetUpForm.proSetUpActivityName
        })]).then(result => {
          list.map((val, index) => {
            val.fileUrl = result[0].data[index]
            val.projectId = result[1].data
          })
          this.$http.fetch(`/file/saveFileList`, list).then(res => {
            if (res.code === 0) {
              this.$router.push(`/expendManagement/management${this.info.hash}`)
            }
          })
        }).catch (error => {
          console.log(error)
        })
      } 
      // 编制采购文件
      else if (title === '编制采购文件和合同拟稿') {
        if (!this.info.isPurchaseOff) {
          this.fileErrList.purchaseErr = this.purchaseList.length > 0?'':'请选择1个或以上采购文件'
          this.fileErrList.SAPErr = this.SAPList.length > 0?'':'请选择1个或以上SAP立项资料'
          if (this.purchaseList.length === 0 || this.SAPList.length === 0) return
          const list = []
          const tatalList = [...this.purchaseList, ...this.SAPList]
          tatalList.forEach((val)=>{
            if(val.raw){
              formDatas.append("file", val.raw); 
              list.push({
                fileCode: val.code,
                fileName: val.name,
                fileSize: val.size,
              })
            }      
          });
          Promise.all([uploadFile, this.$http.fetch(`/project/purchasePlantEdit`,{
            "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
            "isAudit": true,
            "projectId": this.projectEdit.projectId,
            "status": this.projectEdit?.projectStatus, //审核不通过或暂存时传
            "type": 2
          })]).then(result => {
            list.map((val, index) => {
              val.fileUrl = result[0].data[index]
              val.projectId = this.projectEdit.projectId
            })
            this.$http.fetch(`/file/saveFileList`, list).then(res => {
              if (res.code === 0) {
                this.$router.push(`/expendManagement/management${this.info.hash}`)
              }
            })
          }).catch (error => {
            console.log(error)
          })
        } else if (!this.info.isDraftOff) {
          // 表单校验
          this.fileErrList.draftErr = this.draftList.length > 0?'':'请选择1个或以上合同拟稿'
          this.$refs.draftForm.validate((valid) => {
            if (valid && this.draftList.length > 0) {
              // alert('submit!');
            } else {
              console.log('error submit!!');
              loser = true
              return false;
            }
          });
          if (loser) return
          let list = []
          this.draftList.forEach((val)=>{
            if(val.raw){
              formDatas.append("file", val.raw);
              list.push({
                fileCode: val.code,
                fileName: val.name,
                fileSize: val.size,
              })
            }      
          });
          Promise.all([uploadFile, this.$http.fetch(`/project/purchasePlantEdit`,{
            "contractAmount": this.draftForm.contractAmount,
            "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
            "isAudit": true,
            "projectId": this.projectEdit.projectId,
            "rate": this.draftForm.rate,
            "status": this.projectEdit?.projectStatus,
            "type": 3
          })]).then(result => {
            list.map((val, index) => {
              val.fileUrl = result[0].data[index]
              val.projectId = this.projectEdit.projectId
            })
            this.$http.fetch(`/file/saveFileList`, list).then(res => {
              if (res.code === 0) {
                this.$router.push(`/expendManagement/management${this.info.hash}`)
              }
            })
          })
        }
      } 
      // 项目实施
      else if (title === '项目实施') {
        if (this.projectEdit.projectType === 1) {
          this.fileErrList.implementationErr1 = this.implementationList1.length > 0?'':'请选择1个或以上到货验收文件'
          this.fileErrList.implementationImageErr1 = this.implementationImageList1.length > 0?'':'请选择1个或以上实物照片'
          if (this.implementationList1.length === 0 || this.implementationImageList1.length === 0) return
        }else {
          this.fileErrList.implementationErr2 = this.implementationList2.length > 0?'':'请选择1个或以上三措两案文件'
          this.fileErrList.implementationErr3 = this.implementationList3.length > 0?'':'请选择1个或以上外包入场审查文件'
          this.fileErrList.implementationErr4 = this.implementationList4.length > 0?'':'请选择1个或以上开工报告文件'
          this.fileErrList.implementationErr5 = this.implementationList5.length > 0?'':'请选择1个或以上过程监督文件'
          this.fileErrList.implementationErr6 = this.implementationList6.length > 0?'':'请选择1个或以上验收文件'
          this.fileErrList.implementationErr7 = this.implementationList7.length > 0?'':'请选择1个或以上完工总结文件'
          this.fileErrList.implementationImageErr2 = this.implementationImageList2.length > 0?'':'请选择1个或以上实物照片文件'
          if (this.implementationList2.length === 0 || this.implementationList3.length === 0 || this.implementationList4.length === 0 || this.implementationList5.length === 0 || this.implementationList6.length === 0 || this.implementationList7.length === 0 || this.implementationImageList2.length === 0) return
        }
        const list = []
        const tatalList = [...this.implementationList1, ...this.implementationList2, ...this.implementationList3, ...this.implementationList4, ...this.implementationList5, ...this.implementationList6, ...this.implementationList7, ...this.implementationImageList1, ...this.implementationImageList2]
        tatalList.forEach((val)=>{
          if(val.raw){
            formDatas.append("file", val.raw); 
            list.push({
              fileCode: val.code,
              fileName: val.name,
              fileSize: val.size,
            })
          }      
        });
        Promise.all([uploadFile, this.$http.fetch(`/project/implementEdit`,{
          "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
          "idList": [], //关联督办单id
          "isAudit": true,
          "projectId": this.projectEdit.projectId,
          "status": this.projectEdit?.projectStatus,
        })]).then(result => {
          list.map((val, index) => {
            val.fileUrl = result[0].data[index]
            val.projectId = this.projectEdit.projectId
          })
          this.$http.fetch(`/file/saveFileList`, list).then(res => {
            if (res.code === 0) {
              this.$router.push(`/expendManagement/management${this.info.hash}`)
            }
          })
        })
      } 
      else if (title === '入账计划') {
        const planYearList = []
        if (Object.keys(this.yearDelList).length > 0) planYearList.push(this.yearDelList)
        if (this.incomeTableData?.at(-1)?.operation?.[1] === '删除') {
          planYearList.push({
            "comment": this.incomeTableData.at(-1).comment,
            "dataDate": this.incomeTableData.at(-1).year,
            "id": this.investment?.years?.at(-1).id,
            "planAmount": this.incomeTableData.at(-1).planAmount
          })
        }
        this.$http.fetch(`/project/projectInvestmentEdit`,{
            "contractTotal": this.investment.contractTotal,
            "isAudit": (this.incomeTableData.at(-1).id??'' === '') && this.incomeTableData.at(-1).year?true:false, //有新增数据时
            "netPrice": this.investment.netPrice,
            "planYear": planYearList,
            "plantId": this.projectEdit.plantId,
            "projectId": this.projectEdit.projectId,
            "rate": this.investment.rate,
            "rateFlag": this.incomeForm.resource,
            "status": this.investment?.years?.at(-1).status,
        }).then(res => {
          if (res.code === 0) {
            this.$router.push(`/expendManagement/management${this.info.hash}`)
          }
        })
      }
      else if (title === '付款计划') {
        const planYearList = []
        if (Object.keys(this.yearDelList).length > 0) planYearList.push(this.yearDelList)
        if (this.paymentData?.at(-1)?.operation?.[1] === '删除') {
          planYearList.push({
            "comment": this.paymentData.at(-1).comment,
            "dataDate": this.paymentData.at(-1).year,
            "id": this.funds?.years?.at(-1).id,
            "planAmount": this.paymentData.at(-1).planAmount
          })
        }
         this.$http.fetch(`/project/projectFundsEdit`,{
          "isAudit": (this.paymentData.at(-1).id??'' === '') && this.paymentData.at(-1).year?true:false, //有新增数据时
          "planYear": planYearList,
          "plantId": this.projectEdit.plantId,
          "projectId": this.projectEdit.projectId,
          "qualityGuarantee": this.outcomeForm.warranty,
          "qualityGuaranteeMoney": this.outcomeForm.retentionMoney,
          "qualityGuaranteeOutDate": this.$moment(this.outcomeForm.warrantyDate).format('yyyy-MM-DD'),
          "status": this.funds?.years?.at(-1).status,
          }).then(res => {
            if (res.code === 0) {
              this.$router.push(`/expendManagement/management${this.info.hash}`)
            }
          })
        } 
      else if (title === '完工总结') {
        let list = []
        this.commentList.forEach((val)=>{
          if(val.raw){
            formDatas.append("file", val.raw);
            list.push({
              fileCode: val.code,
              fileName: val.name,
              fileSize: val.size,
            })
          }      
        });
        Promise.all([uploadFile, this.$http.fetch(`/project/projectDoneEdit`, {
          "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
          "evaluate": this.endForm.evaluate,
          "isAudit": true,
          "projectId": this.projectEdit.projectId,
          "status": this.projectEdit?.projectStatus,
        })]).then(result => {
          list.map((val, index) => {
            val.fileUrl = result[0].data[index]
            val.projectId = this.projectEdit.projectId
          })
          this.$http.fetch(`/file/saveFileList`, list).then(res => {
            if (res.code === 0) {
              this.$router.push(`/expendManagement/management${this.info.hash}`)
            }
          })
        })
      }
      else if (title === '供应商评价') {
        this.$http.fetch(`/project/projectEvaluateEdit`, {
          "cooperate": this.supplierForm.num3,
          "deliverTimeliness":  this.supplierForm.num4,
          "evaluate": this.supplierForm.supplier,
          "isAudit": true,
          "projectId": this.projectInfo.purchase.projectId,
          "qualification": this.supplierForm.num1,
          "qualityAssurance":  this.supplierForm.num2,
          "status": this.projectEdit?.projectStatus,
          "supplierName": this.projectInfo.purchase.contractSigningOrg
        }).then(res => {
          if (res.code === 0) {
            this.$router.push(`/expendManagement/management${this.info.hash}`)
          }
        })
      }
    },
    temporaryStorage (title) {
      let loser = false
      const formDatas = new FormData();
      const uploadFile = this.$http.upload(`/file/uploadFileList?date=${this.$moment().format('yyyy-MM-DD')}&type=3`, formDatas)
      // 项目立项
      if (title === '项目立项') {
        let list = []
        this.approvalList.forEach((val)=>{
          if(val.raw){
            formDatas.append("file", val.raw);
            list.push({
              fileCode: val.code,
              fileName: val.name,
              fileSize: val.size,
            })
          }      
        });
        Promise.all([uploadFile, this.$http.fetch(`/project/projectEdit`, {
          "budget": this.proSetUpForm.proSetUpMoney,
          "budgetCheck": this.proSetUpForm.proSetUpCheck,
          "budgetCode": this.proSetUpForm.proSetUpBudgetCode,
          "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
          "isAudit": false,
          "planPurchasingTime": this.proSetUpForm.proSetUpTime,
          "plantId": this.proSetUpForm.proSetUpPlant,
          "projectId": this.proSetUpForm?.projectId, 
          "projectType": this.proSetUpForm.proSetUpProjectType,
          "purchasingMethod": this.proSetUpForm.proSetUpPurchasingMethod,
          "status": this.projectEdit?.projectStatus,
          "tenderName": this.proSetUpForm.proSetUpActivityName
        })]).then(result => {
          list.map((val, index) => {
            val.fileUrl = result[0].data[index]
            val.projectId = result[1].data
          })
          this.$http.fetch(`/file/saveFileList`, list).then(res => {
            if (res.code === 0) {
              this.$router.push(`/expendManagement/management${this.info.hash}`)
            }
          })
        }).catch (error => {
          console.log(error)
        })
      } 
      // 编制采购文件
      else if (title === '编制采购文件和合同拟稿') {
        if (!this.info.isPurchaseOff) {
          const list = []
          const tatalList = [...this.purchaseList, ...this.SAPList]
          tatalList.forEach((val)=>{
            if(val.raw){
              formDatas.append("file", val.raw); 
              list.push({
                fileCode: val.code,
                fileName: val.name,
                fileSize: val.size,
              })
            }      
          });
          Promise.all([uploadFile, this.$http.fetch(`/project/purchasePlantEdit`,{
            "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
            "isAudit": false,
            "projectId": this.projectEdit.projectId,
            "status": this.projectEdit?.projectStatus, //审核不通过或暂存时传
            "type": 2
          })]).then(result => {
            list.map((val, index) => {
              val.fileUrl = result[0].data[index]
              val.projectId = this.projectEdit.projectId
            })
            this.$http.fetch(`/file/saveFileList`, list).then(res => {
              if (res.code === 0) {
                this.$router.push(`/expendManagement/management${this.info.hash}`)
              }
            })
          }).catch (error => {
            console.log(error)
          })
        } else if (!this.info.isDraftOff) {
          // 表单校验
          this.fileErrList.draftErr = this.draftList.length > 0?'':'请选择1个或以上合同拟稿'
          this.$refs.draftForm.validate((valid) => {
            if (valid && this.draftList.length > 0) {
              // alert('submit!');
            } else {
              console.log('error submit!!');
              loser = true
              return false;
            }
          });
          if (loser) return
          let list = []
          this.draftList.forEach((val)=>{
            if(val.raw){
              formDatas.append("file", val.raw);
              list.push({
                fileCode: val.code,
                fileName: val.name,
                fileSize: val.size,
              })
            }      
          });
          Promise.all([uploadFile, this.$http.fetch(`/project/purchasePlantEdit`,{
            "contractAmount": this.draftForm.contractAmount,
            "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
            "isAudit": false,
            "projectId": this.projectEdit.projectId,
            "rate": this.draftForm.rate,
            "status": this.projectEdit?.projectStatus,
            "type": 3
          })]).then(result => {
            list.map((val, index) => {
              val.fileUrl = result[0].data[index]
              val.projectId = this.projectEdit.projectId
            })
            this.$http.fetch(`/file/saveFileList`, list).then(res => {
              if (res.code === 0) {
                this.$router.push(`/expendManagement/management${this.info.hash}`)
              }
            })
          })
        }
      } 
      // 项目实施
      else if (title === '项目实施') {
        const list = []
        const tatalList = [...this.implementationList1, ...this.implementationList2, ...this.implementationList3, ...this.implementationList4, ...this.implementationList5, ...this.implementationList6, ...this.implementationList7, ...this.implementationImageList1, ...this.implementationImageList2]
        tatalList.forEach((val)=>{
          if(val.raw){
            formDatas.append("file", val.raw); 
            list.push({
              fileCode: val.code,
              fileName: val.name,
              fileSize: val.size,
            })
          }      
        });
        Promise.all([uploadFile, this.$http.fetch(`/project/implementEdit`,{
          "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
          "idList": [], //关联督办单id
          "isAudit": false,
          "projectId": this.projectEdit.projectId,
          "status": this.projectEdit?.projectStatus,
        })]).then(result => {
          list.map((val, index) => {
            val.fileUrl = result[0].data[index]
            val.projectId = this.projectEdit.projectId
          })
          this.$http.fetch(`/file/saveFileList`, list).then(res => {
            if (res.code === 0) {
              this.$router.push(`/expendManagement/management${this.info.hash}`)
            }
          })
        })
      } 
      else if (title === '入账计划') {
        const planYearList = []
        if (Object.keys(this.yearDelList).length > 0) planYearList.push(this.yearDelList)
        if (this.incomeTableData?.at(-1)?.operation?.[1] === '删除') {
          planYearList.push({
            "comment": this.incomeTableData.at(-1).comment,
            "dataDate": this.incomeTableData.at(-1).year,
            "id": this.investment?.years?.at(-1).id,
            "planAmount": this.incomeTableData.at(-1).planAmount
          })
        }
        this.$http.fetch(`/project/projectInvestmentEdit`,{
            "contractTotal": this.investment.contractTotal,
            "isAudit": false, //有新增数据时
            "netPrice": this.investment.netPrice,
            "planYear": planYearList,
            "plantId": this.projectEdit.plantId,
            "projectId": this.projectEdit.projectId,
            "rate": this.investment.rate,
            "rateFlag": this.incomeForm.resource,
            "status": this.investment?.years?.at(-1).status,
        }).then(res => {
          if (res.code === 0) {
            this.$router.push(`/expendManagement/management${this.info.hash}`)
          }
        })
      }
      else if (title === '付款计划') {
        const planYearList = []
        if (Object.keys(this.yearDelList).length > 0) planYearList.push(this.yearDelList)
        if (this.paymentData?.at(-1)?.operation?.[1] === '删除') {
          planYearList.push({
            "comment": this.paymentData.at(-1).comment,
            "dataDate": this.paymentData.at(-1).year,
            "id": this.funds?.years?.at(-1).id,
            "planAmount": this.paymentData.at(-1).planAmount
          })
        }
         this.$http.fetch(`/project/projectFundsEdit`,{
          "isAudit": false, //有新增数据时
          "planYear": planYearList,
          "plantId": this.projectEdit.plantId,
          "projectId": this.projectEdit.projectId,
          "qualityGuarantee": this.outcomeForm.warranty,
          "qualityGuaranteeMoney": this.outcomeForm.retentionMoney,
          "qualityGuaranteeOutDate": this.$moment(this.outcomeForm.warrantyDate).format('yyyy-MM-DD'),
          "status": this.funds?.years?.at(-1).status,
          }).then(res => {
            if (res.code === 0) {
              this.$router.push(`/expendManagement/management${this.info.hash}`)
            }
          })
        } 
      else if (title === '完工总结') {
        let list = []
        this.commentList.forEach((val)=>{
          if(val.raw){
            formDatas.append("file", val.raw);
            list.push({
              fileCode: val.code,
              fileName: val.name,
              fileSize: val.size,
            })
          }      
        });
        Promise.all([uploadFile, this.$http.fetch(`/project/projectDoneEdit`, {
          "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
          "evaluate": this.endForm.evaluate,
          "isAudit": false,
          "projectId": this.projectEdit.projectId,
          "status": this.projectEdit?.projectStatus,
        })]).then(result => {
          list.map((val, index) => {
            val.fileUrl = result[0].data[index]
            val.projectId = this.projectEdit.projectId
          })
          this.$http.fetch(`/file/saveFileList`, list).then(res => {
            if (res.code === 0) {
              this.$router.push(`/expendManagement/management${this.info.hash}`)
            }
          })
        })
      }
      else if (title === '供应商评价') {
        this.$http.fetch(`/project/projectEvaluateEdit`, {
          "cooperate": this.supplierForm.num3,
          "deliverTimeliness":  this.supplierForm.num4,
          "evaluate": this.supplierForm.supplier,
          "isAudit": false,
          "projectId": this.projectInfo.purchase.projectId,
          "qualification": this.supplierForm.num1,
          "qualityAssurance":  this.supplierForm.num2,
          "status": this.projectEdit?.projectStatus,
          "supplierName": this.projectInfo.purchase.contractSigningOrg
        }).then(res => {
          if (res.code === 0) {
            this.$router.push(`/expendManagement/management${this.info.hash}`)
          }
        })
      }
    },
    budgetary () {
      if (this.proSetUpForm.proSetUpMoney && this.proSetUpForm.proSetUpMoney >= 0 && this.proSetUpForm.proSetUpBudgetCode && this.proSetUpForm.proSetUpTime && this.proSetUpForm.proSetUpPlant) {
        this.$http.fetchGet(`/budget/budgetCheck?amount=${this.proSetUpForm.proSetUpMoney}&budgetCode=${this.proSetUpForm.proSetUpBudgetCode}&date=${this.$moment(this.proSetUpForm.proSetUpTime).format('yyyy-01-01')}&plantId=${this.proSetUpForm.proSetUpPlant}`).then(res => {
        if (res.code === 0) {
            if (res.data.length > 0) {
              this.proSetUpForm.proSetUpCheck = true
              this.proSetUpForm.plantResidue = res.data[0]
              this.proSetUpForm.totalResidue = res.data[1]
            }else {
              this.proSetUpForm.proSetUpCheck = false
            }
          }
        })
      } 
    },
    cencel () {
      this.$router.push(`/expendManagement/management${this.info.hash}`)
    },
    submitUpload () {
      this.$refs.upload.submit();
    },
    handleRemove (file, fileList) {  //文件列表移除文件时的钩子
      console.log(file, fileList);
    },
    handlePreview (file) {   //点击文件列表中已上传的文件时的钩子
      console.log(file);
    },
    handleChange (file, fileList, params) { 
      let coll = 'collapse1'
      if (params === '立项支撑文件') {
        this.approvalList = fileList
        if (this.approvalList.length > 0) this.fileErrList.approvalErr = ''
      }else if (params === '采购文件') {
        this.purchaseList = fileList
        if (this.purchaseList.length > 0) this.fileErrList.purchaseErr = ''
        coll = 'collapse2'
      }else if (params === 'SAP立项资料') {
        this.SAPList = fileList
        if (this.SAPList.length > 0) this.fileErrList.SAPErr = ''
        coll = 'collapse2'
      }else if (params === '合同拟稿') {
        this.draftList = fileList
        if (this.draftList.length > 0) this.fileErrList.draftErr = ''
        coll = 'collapse2'
      }else if (params === '项目实施1') {
        this.implementationList1 = fileList
        if (this.draftList.length > 0) this.fileErrList.implementationErr1 = ''
        coll = 'collapse3'
      }else if (params === '项目实施2') {
        this.implementationList2 = fileList
        if (this.draftList.length > 0) this.fileErrList.implementationErr2 = ''
        coll = 'collapse3'
      }else if (params === '项目实施3') {
        this.implementationList3 = fileList
        if (this.draftList.length > 0) this.fileErrList.implementationErr3 = ''
        coll = 'collapse3'
      }else if (params === '项目实施4') {
        this.implementationList4 = fileList
        if (this.draftList.length > 0) this.fileErrList.implementationErr4 = ''
        coll = 'collapse3'
      }else if (params === '项目实施5') {
        this.implementationList5 = fileList
        if (this.draftList.length > 0) this.fileErrList.implementationErr5 = ''
        coll = 'collapse3'
      }else if (params === '项目实施6') {
        this.implementationList6 = fileList
        if (this.draftList.length > 0) this.fileErrList.implementationErr6 = ''
        coll = 'collapse3'
      }else if (params === '项目实施7') {
        this.implementationList7 = fileList
        if (this.draftList.length > 0) this.fileErrList.implementationErr7 = ''
        coll = 'collapse3'
      }else if (params === '项目实施图片1') {
        this.tag = '实物照片'
        this.code = 402
        this.implementationImageList1 = fileList
        if (this.draftList.length > 0) this.fileErrList.implementationImageErr1 = ''
        coll = 'collapse3'
      }else if (params === '项目实施图片2') {
        this.tag = '实物照片'
        this.code = 410
        this.implementationImageList2 = fileList
        if (this.draftList.length > 0) this.fileErrList.implementationImageErr2 = ''
        coll = 'collapse3'
      }else if (params === '项目评价报告') {
        this.commentList = fileList
        if (this.draftList.length > 0) this.fileErrList.commentErr = ''
        coll = 'collapse6'
      }
      file.tag = this.tag   //把选中时的tag添加到对象上 
      file.code = this.code   //把选中时的tag添加到对象上 
      file.fileSize = file.size
      this.$nextTick(()=>{  //页面发生改变时，触发收缩面板重新计算高度
        this.$refs[coll].settingDefaultShow()
      })
    },
    selectFile (item) { //选择文件完毕等待上传
      this.tag = item.value   //给文件打上tag，如‘可行性研究报告’
      this.code = item.id  
    },
    addFileListBtn () {
      
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureCardPreview2(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible2 = true;
    },
    handleClick () {

    },
    arraySpanMethod({ rowIndex, columnIndex }) { //表格合并
      if (rowIndex  === 0) {
        if (columnIndex === 0) {
          return [1, 6];
        } else {
          return [0, 0];
        }
      }
    },
    setBlue (row) {
      if (['新增年度入账计划', '新增年度付款计划'].includes(row.serialNumber)) { //新增入账计划的样式
        return {
          blueTextBtn: true
        }
      }
    },
    increaseIncome (row) { //新增入账
      if (this.info.billReadonly) return 
      if (row.serialNumber === '新增年度入账计划' && !this.info.isInvestOff && this.incomeTableData?.at(-1)?.operation?.[1] !== '删除' && (this.investment.years ? this.incomeTableData?.at(-1)?.status === 4 : true)) {
        this.increaseDialog = true
        this.enterform = { 
          year: this.$moment().format('yyyy'),
          money: '',
          remark: '',
          check: false
        }
      }
    },
    increasePayment (row) { //新增付款
      if (this.info.payReadonly) return
      if (row.serialNumber === '新增年度付款计划' && !this.info.isCapitalOff && this.paymentData?.at(-1)?.operation?.[1] !== '删除' && (this.funds.years ? this.paymentData?.at(-1)?.status === 4 : true)) { 
        this.paymentDialog = true
        this.comeform = {
          year: this.$moment().format('yyyy'),
          money: '',
          remark: '',
          check: false
        }
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
           let total = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return '--';
            }
          }, 0);
          if (total > 1000) { //区别于入账材料数量和入账金额
            total = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
          }else {
            total = '--'
          }
          sums[index] = total
          if (sums[index] == 0) { //数据为空时，把0转成--
            sums[index] = '--'
          }
          // sums[index] += ' 元';
        } else {
          sums[index] = '--';
        }
      });
      return sums;
    },
    moneyFormat(money) {  //千分位带两位小数
      if ((money ?? '') === '') {return ''}
      return Number(money).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    },
    onSubmit(tableData, form) {
      this[tableData].push({
        serialNumber: this.addSerialNum(tableData),
        year: `${this.$moment(this[form].year).format('YYYY-01-01')}`,
        incomeMoney: this[form].money,
        remark: this[form].remark,
        status: '审核中',
        operation: '删除'
      })
      this.increaseDialog = false
      this.paymentDialog = false
      this[form] = []
      this.$nextTick(()=>{  //页面发生改变时，触发收缩面板重新计算高度
        this.$refs.collapse.settingDefaultShow()
      })
    },
    addMonthRecord () {
      this.$http.fetch(`/project/billOperationEdit`, {
        "amount": this.recoedform.money,
        "comment": this.recoedform.remark,
        "dataDate": this.recoedform.month,
        "parentId": this.infoRecord.id
      }).then(res => {
        if (res.code === 0) {
          this.earning()
          this.increaseRecord = false
        }
      })
    },
    addMonthRecord2 () {
      this.$http.fetch(`/project/payOperationEdit`, {
        "amount": this.payRecoedform.money,
        "comment": this.payRecoedform.remark,
        "dataDate": this.payRecoedform.month,
        "parentId": this.infoRecord.id
      }).then(res => {
        if (res.code === 0) {
          this.expend()
          this.payRecord = false
        }
      })
    },
    addSerialNum (tableData) {
      if (this[tableData].length < 10) {
        return `0${this[tableData].length}`
      }else {
        return this[tableData].length
      }
    },
    inFunctionality (row) {
      if (!this.info.isInvestOff) {
        this.increaseRecord = true
        this.infoRecord = row
      }
    },
    outFunctionality (row) {
      if (!this.info.isCapitalOff) {
        this.payRecord = true
        this.infoRecord = row
      }
    },
    earning () {
      this.$http.fetchGet(`/project/getInfo?projectId=${this.projectEdit.projectId}`).then(res => { 
        let investment = res.data.investment
        this.incomeForm.contractTotal = investment?.contractTotal
        this.incomeForm.rate = investment?.rate
        this.incomeForm.netPrice = investment?.netPrice
        this.incomeForm.amountSum = investment?.amountSum
        this.incomeForm.amountSumRatio = investment?.amountSumRatio
        // 年度入账
        this.incomeTableData = [{serialNumber: '新增年度入账计划'}]
        investment?.years && this.incomeTableData.push(...investment.years)
        this.incomeTableData.map((val, index) => {
          if (index > 0) {
            val.serialNumber = index
            val.year = val.dataDate
          }
        })
        // 入账明细 
        this.inDetailData = []
        investment?.months && this.inDetailData.push(...investment.months)
        this.inDetailData.map((val, index) => {
          val.serialNumber = index + 1
          val.month = this.$moment(val.dataDate).format('yyyy年MM月')
          val.operation = parseInt(val.planAmount) > parseInt(val.actualAmount?val.actualAmount:'0')? '添加入账记录': '查看'
          val.materials = []
          this.projectInfo.files?.[7] && this.projectInfo.files[7].map(row => {
            if (row.dataDate === val.dataDate) {
              val.materials.push(row)
            }
          })
        })
        //刷新页面
        if (this.info.title === '入账计划') {
          this.$nextTick(() => {
            this.$refs.collapse4.settingDefaultShow()
          })
        }
      })
    },
    expend () {
      this.$http.fetchGet(`/project/getInfo?projectId=${this.projectEdit.projectId}`).then(res => { 
        let funds = res.data.funds
        this.outcomeForm.retentionMoney = funds?.qualityGuaranteeMoney
        this.outcomeForm.warranty = funds?.qualityGuarantee
        this.outcomeForm.warrantyDate = funds?.qualityGuaranteeOutDate
        this.outcomeForm.amountSum = funds?.amountSum
        this.outcomeForm.amountSumRatio = funds?.amountSumRatio
        // 年度付款
        this.paymentData = [{serialNumber: '新增年度付款计划'}]
        funds?.years && this.paymentData.push(...funds.years)
        this.paymentData.map((val, index) => {
          if (index > 0) {
            val.serialNumber = index
            val.year = val.dataDate
          }
        })
        // 付款明细 
        this.outDetailData = []
        funds?.months && this.outDetailData.push(...funds.months)
        this.outDetailData.map((val, index) => {
          val.serialNumber = index + 1
          val.month = this.$moment(val.dataDate).format('yyyy年MM月')
          val.operation = parseInt(val.planAmount) > parseInt(val.actualAmount?val.actualAmount:'0')? '添加付款记录': '查看'
        })
        // 刷新页面
        if (this.info.title === '付款计划') {
          this.$nextTick(() => {
            this.$refs.collapse5.settingDefaultShow()
          })
        }
      })
    },
    checkBudget (form, type) {
      this.$http.fetchGet(`/budget/yearBudgetCheck?amount=${this[form].money}&date=${this.$moment(this[form].year).format('yyyy-01-01')}&projectId=${this.projectEdit.projectId}&type=${type}`).then(res => {
        if (res.data[0]) {
          this[form].check = true
          this[form].plantResidue = res.data[0]
          this[form].totalResidue = res.data[1]
        }else {
          this[form].check = false
        }
        console.log(this[form].check); 
      })
    },
    inDetailsRecord (row) {
      this.$http.fetchGet(`/project/getBillOperation?monthId=${row.id}`).then(res => {
        if (res.code === 0) {
          this.DeRecodeDialog = true
          this.BillOperation = res.data
          this.BillOperation.map((val, index) => {
            val.no = index + 1
          })
        }
      })
    },
    outDetailsRecord (row) {
      this.$http.fetchGet(`/project/getPayOperation?monthId=${row.id}`).then(res => {
        this.payRecodeDialog = true
        this.payOperation = res.data
        console.log(this.payOperation);
      })
    },
    increaseYear () {
      if (this.incomeTableData?.at(-1)?.operation?.[1]) this.incomeTableData.pop()
      this.incomeTableData.push({
        serialNumber: this.incomeTableData.length,
        year: `${this.$moment(this.enterform.year).format('YYYY-01-01')}`,
        planAmount: this.enterform.money,
        comment: this.enterform.remark,
        statusName: '待审核',
        operation: ['编辑', '删除']
      })
      this.increaseDialog = false
      //刷新页面
      this.$nextTick(() => {
        this.$refs.collapse4.settingDefaultShow()
      })
    },
    paymentYear () {
      if (this.paymentData?.at(-1)?.operation?.[1]) this.paymentData.pop()
      this.paymentData.push({ 
        serialNumber: this.paymentData.length,
        year: `${this.$moment(this.comeform.year).format('YYYY-01-01')}`,
        planAmount: this.comeform.money,
        comment: this.comeform.remark,
        statusName: '待审核',
        operation: ['编辑', '删除']
      })
      this.paymentDialog = false
      //刷新页面
      this.$nextTick(() => {
        this.$refs.collapse5.settingDefaultShow()
      })
    },
    hoverEnter () {
      clearTimeout(this.timerLeave)
    },
    hoverLeave (materialsShow) {
      this[materialsShow] = false
    },
    MEnter (e, materials, materialsShow, uploadList) {
      clearTimeout(this.timerLeave)
      this.bookedMaterial = materials //悬浮展示的数据源
      this[materialsShow] = true  //此时变量为true，但页面还没重新渲染
      this.$nextTick(() => {
        let DOMRect = e.srcElement.getBoundingClientRect()
        this.$refs[uploadList].style.left = `${DOMRect.left - this.$refs[uploadList].clientWidth}px`
        this.$refs[uploadList].style.top = `${DOMRect.top - this.$refs[uploadList].clientHeight}px`
      })
    },
    MLeave (materialsShow) { //移出后1s消失,如果进入展示区域或其他材料区域，将取消1s消失得动作
      this.timerLeave = setTimeout(() => {
        this[materialsShow] = false
      }, 320);
    },
    fileDel (file, fileList, coll, fileNum) {
      const exist = this.files?.[fileNum]?.find(val => val.fileCode === file.fileCode && val.fileName === file.fileName)
      if (exist) this.delList[exist.id] = exist.fileUrl
      // 删除时判断是否是数据库来的数据，是数据库来的就记录一下
      const index = fileList.findIndex(val => {
        return val.uid === file.uid
      })
      fileList.splice(index, 1)
      this.$nextTick(()=>{  //页面发生改变时，触发收缩面板重新计算高度
        this.$refs[coll].settingDefaultShow()
      })
    },
    download (row) {
      this.$http.download(`/file/downloadFile?id=${row.id}`).then(res => {
        this.$fileDownload(res.data, row.fileName)
      })
    },
    yearPlanEdit (data, row) {
      if (data === 'incomeTableData') {
        this.increaseDialog  = true
        this.enterform.year = this.incomeTableData?.at(-1).year
        this.enterform.money = this.incomeTableData?.at(-1).planAmount
        this.enterform.remark = this.incomeTableData?.at(-1).comment
        this.checkBudget('enterform', 1)
      }else {
        this.paymentDialog = true
        this.comeform.year = this.paymentData?.at(-1).year
        this.comeform.money = this.paymentData?.at(-1).planAmount
        this.comeform.remark = this.paymentData?.at(-1).comment
        this.checkBudget('comeform', 2)
      }
    },
    del (table, row) {
      if (row.id) {
        this.yearDelList = {
          amountSum: row.monthAmountSum,
          comment: row.comment,
          dataDate: row.dataDate,
          deleteFlag: true,
          id: row.id,
          planAmount: row.planAmount,
        }
      }
      this[table].pop()
    },
  },
  components: {timelineForm}
}
</script>

<style lang="less" scoped>
.managementDetails {
  width: 100%;
  height: 100%;
  .header {
    min-height: 64px;
    line-height: 64px;
    font-size: 16px;
    margin-top: 10px;
    padding-left: 22px;
    border-bottom: 1px solid #f2f2f2;
    background-color: #fff; 
    span {
      line-height: 26px;
    }
    i {
      font-size: 26px;
    }
  }
  .container {
    max-height: calc(100% - 64px - 74px - 96px);
    overflow: auto;
    border-radius: 6px;
    background-color: #fff;
    .detailsContent {
      padding: 0 10px;
      .projectSetUp, .purchase, .draft, .implementation, .income, .outcome, .comment {
        p {
          display: flex;
          > div {
            flex: 1;
            padding: 0 20px;
            /deep/ .el-select, .el-date-editor {
              width: 100%;
            }
          }
        }
        .uploading {
          button {
            height: 36px;
            padding: 0 20px;
            border: 1px dashed #DCDFE6;
            border-radius: 0;
          }
          .upload-demo {
            margin-bottom: 10px;
          }
          .uploadList {
            max-width: 1240px;
            min-height: 40px;
            padding: 10px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            ul li {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              padding: 0 10px;
              margin-bottom: 10px;
              list-style: none;
              background-color: rgba(0, 0, 0, 0.03);
              >span:nth-of-type(1) {
                >span:nth-of-type(1) {
                  display: inline-block;
                  width: 160px;
                  height: 24px;
                  line-height: 24px;
                  font-size: 10px;
                  padding: 0 14px;
                  text-align: center;
                  border-radius: 4px;
                }
              }
              >span:nth-of-type(2) {
                flex: 1;
                margin: 0 20px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              >span:nth-of-type(3) {
                margin: 0 20px;
              }
              >span:nth-of-type(4) {
                margin-right: 10px;
                font-size: 20px;
                cursor: pointer;
              }
            }
            ul li:nth-last-of-type(1) {
              margin-bottom: 0px;
            }
          }
        }
      }
      .draft p:nth-of-type(1), .income p:nth-of-type(1), .income p:nth-of-type(5), .outcome p:nth-of-type(5){
          span {
            font-size: 20px;
          }
          span:nth-of-type(2) {
            margin: 0 6px;
          }
          span:nth-of-type(3) {
            font-size: 14px;
          }
      }
      .draft {
        border-top: 1px dashed rgba(0, 0, 0, 0.2);
        padding-top: 20px;
      }
      .comment {
        .rate {
          div span:nth-of-type(1) {
            display: inline-block;
            width: 100px;
            margin-right: 20px;
          }
          >div >div:nth-last-of-type(1) {
            margin-top: 10px;
          }
        }
      }
      .hoverShow {  //悬浮框
        position:fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 600px;
        background-color: #fff;
        box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
        h4 {
          padding: 0 10px;
          line-height: 46px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .SContent {
          padding: 10px;
          li {
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            margin-bottom: 10px;
            list-style: none;
            background-color: rgba(0, 0, 0, 0.03);
            >span:nth-of-type(1) {
              >span:nth-of-type(1) {
                display: inline-block;
                width: 100px;
                height: 24px;
                line-height: 24px;
                font-size: 10px;
                padding: 0 14px;
                text-align: center;
                border-radius: 4px;
              }
            }
            >span:nth-of-type(2) {
              flex: 1;
              margin: 0 20px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            >span:nth-of-type(3) {
              text-align: right;
            }
            >span:nth-of-type(4) {
              margin: 0 10px;
              font-size: 20px;
              line-height: 40px;
              cursor: pointer;
            }
          }
          li:nth-last-of-type(1) {
            margin-bottom: 0px;
          }
        }
      }
      .detailsRecord { //入账次数弹框
        .TLHeader {
          margin-bottom: 16px;
          >span:nth-of-type(2) {
            color: #999;
          }
        }
      }
      /deep/ .el-dialog__header {
        padding: 20px;
        border-bottom: 1px solid #f2f2f2;
      }
      /deep/ .el-upload {
        text-align: left;
      }
      .btns {
        height: 62px;
        padding-bottom: 22px;
        > button:nth-of-type(2) {
          margin: 0 10px;
          max-height: 40px;
        }
      }
      /deep/ .el-button {
        color: #409EFF;
      }
      /deep/ .el-button--primary {
        color: #fff;
      }
      /deep/ .el-upload--picture-card {
        text-align: center;
        width: 96px;
        height: 96px;
        line-height: 96px;
        margin-bottom: 9px;
      }
      /deep/ .el-upload-list--picture-card {
        line-height: 0;
      }
      /deep/ .el-upload-list--picture-card .el-upload-list__item {
        width: 96px;
        height: 96px;
      }
      /deep/ .el-dialog__body {
        padding: 30px 20px 0 20px;
      }
      /deep/ .el-dialog__footer {
        text-align: center;
      }
      // /deep/ .el-form-item {  //表单中表格
      //   overflow: hidden;
      // }
      /deep/ .el-table .el-table__cell {
        padding: 0;
      }
      /deep/ .el-table .el-table__body-wrapper td {
        padding: 12px 0;
      }
      .contractStatus {
        color: red;
        i {
          margin-right: 10px;
        }
      }
      .blueTextBtn {
        color: #409EFF;
        cursor: pointer;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .uploadNumStyle {
        margin-left: 10px;
        padding: 0px 20px;
        height: 30px;
        line-height: 30px;
        color: #409EFF;
        background-color: #EBF7FE;
        border-radius: 30px;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .process {
    margin-top: 10px;
    background-color: #fff;
    min-height: 66px;
    max-height: 250px;
    overflow: auto;
    .statusWrap {
      > span:nth-of-type(2) {
        font-size: 12px;
        height: 34px;
        line-height: 34px;
        padding: 0 30px;
        border-radius: 4px;
      }
    }
  }
}
</style>